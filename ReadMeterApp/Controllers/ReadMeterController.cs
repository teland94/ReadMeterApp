using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReadMeterApp.Exceptions;
using ReadMeterApp.Models;
using ReadMeterApp.Services;
using ReadMeterApp.ViewModels;

namespace ReadMeterApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReadMeterController : ControllerBase
    {
        private IBlickerService BlickerService { get; set; }

        public ReadMeterController(IBlickerService blickerService)
        {
            BlickerService = blickerService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm]BlickerPostViewModel model)
        {
            var base64Data = Regex.Match(model.Image, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);

            try
            {
                var readerData = await BlickerService.Read(binData);
                var meter = readerData.Objects.Meter.FirstOrDefault();
                return Ok(new ReadMeterResult
                {
                    DisplayType = meter?.DisplayType,
                    Messages = readerData.Messages,
                    MeterCategory = meter?.MeterCategory,
                    DisplayValue = meter?.Objects.Display[0].Value
                });
            }
            catch (BlickerApiException e)
            {
                return StatusCode(422, e.ValidationError);
            }
        }
    }
}
