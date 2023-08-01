using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
       
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService,IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
           
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExist(registerDto.UserName)) return BadRequest("Username is taken");

            var user= _mapper.Map<AppUser>(registerDto);
            
             user.UserName = registerDto.UserName.ToLower();
              
            
           var result = await _userManager.CreateAsync(user,registerDto.Password);

           if(!result.Succeeded) return BadRequest(result.Errors);

           var roleResult = await _userManager.AddToRoleAsync(user,"Member");
           if(!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };


        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto LoginDto)
        {
            var user = await _userManager.Users
            .Include(p=>p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == LoginDto.Username);

            if (user == null) return Unauthorized("invalid username");

            var result = await _userManager.CheckPasswordAsync(user, LoginDto.Password);

            if(!result) return Unauthorized("Invalid password");
            
             return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl=user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                KnownAs = user.KnownAs
            };

        }
        private async Task<bool> UserExist(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}