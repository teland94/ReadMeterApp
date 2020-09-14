using System.IO;
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
            byte[] imageData;

            using (var binaryReader = new BinaryReader(model.Image.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)model.Image.Length);
            }

            try
            {
                //var readerData = await BlickerService.Read(imageData);
                //var meter = readerData.Objects.Meter[0];
                //return Ok(new ReadMeterResult
                //{
                //    DisplayType = meter.DisplayType,
                //    Messages = meter.Messages,
                //    MeterCategory = meter.MeterCategory,
                //    DisplayValue = meter.Objects.Display[0].Value
                //});
                return Ok(new ReadMeterResult());
            }
            catch (BlickerApiException e)
            {
                return StatusCode(422, e.ValidationError);
            }
        }
    }
}
