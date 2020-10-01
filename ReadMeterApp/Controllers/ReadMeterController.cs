using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ReadMeterApp.Exceptions;
using ReadMeterApp.Interfaces;
using ReadMeterApp.Models;
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
                var readerData = await BlickerService.Read(imageData, model.Language);
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
                return StatusCode(400, e.Error);
            }
            catch (BlickerApiValidationException e)
            {
                return StatusCode(422, e.ValidationError);
            }
        }
    }
}
