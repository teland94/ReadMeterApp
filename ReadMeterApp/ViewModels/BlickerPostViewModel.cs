using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ReadMeterApp.ViewModels
{
    public class BlickerPostViewModel
    {
        [Required]
        public IFormFile Image { get; set; }

        public string Language { get; set; }
    }
}
