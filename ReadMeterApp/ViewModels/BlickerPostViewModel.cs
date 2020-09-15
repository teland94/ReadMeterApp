using System.ComponentModel.DataAnnotations;
using DataUtils;

namespace ReadMeterApp.ViewModels
{
    public class BlickerPostViewModel
    {
        [Required]
        public string Image { get; set; }
    }
}
