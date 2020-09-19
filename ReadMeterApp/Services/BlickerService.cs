using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ReadMeterApp.Exceptions;
using ReadMeterApp.Models;

namespace ReadMeterApp.Services
{
    public interface IBlickerService
    {
        Task<BlickerResult> Read(byte[] image, string language);

        Task<AliveResult> Alive();
    }

    public class BlickerService : IDisposable, IBlickerService
    {
        private readonly HttpClient _httpClient;

        public BlickerService()
        {
            _httpClient = new HttpClient {BaseAddress = new Uri("https://api.blicker.ai")};
            _httpClient.DefaultRequestHeaders.Add("subscription-key", "84fa0c01037b4b48b38e5a2582aaafc9");
        }

        public async Task<BlickerResult> Read(byte[] image, string language)
        {
            using var content = new MultipartFormDataContent
            {
                { new ByteArrayContent(image, 0, image.Length), "image", "UploadFile" },
                { new StringContent(string.Empty), "ranges" },
                { new StringContent(string.Empty), "serialNumber" },
                { new StringContent(string.Empty), "referenceId" },
                { new StringContent(string.Empty), "meterCategory" },
                { new StringContent(string.Empty), "displayType" },
                { new StringContent(string.Empty), "nDigits" },
                { new StringContent(string.Empty), "nDisplays" },
                { new StringContent(string.Empty), "GPSLocation" },
                { new StringContent(string.Empty), "datetime" }
            };
            if (language != null)
            {
                content.Add(new StringContent(language), "language");
            }

            using var response = await _httpClient.PostAsync("/blicker/2020-05-01", content);
            var apiResponse = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<BlickerResult>(apiResponse);
            }

            throw response.StatusCode switch
            {
                HttpStatusCode.UnprocessableEntity => new BlickerApiValidationException(
                    JsonConvert.DeserializeObject<BlickerApiValidationError>(apiResponse)),
                HttpStatusCode.BadRequest => new BlickerApiException(
                    JsonConvert.DeserializeObject<BlickerApiError>(apiResponse)),
                _ => new InvalidOperationException(apiResponse)
            };
        }

        public async Task<AliveResult> Alive()
        {
            using var response = await _httpClient.GetAsync("/alive");
            response.EnsureSuccessStatusCode();
            var apiResponse = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonConvert.DeserializeObject<AliveResult>(apiResponse);
            }

            throw new BlickerApiValidationException(JsonConvert.DeserializeObject<BlickerApiValidationError>(apiResponse));
        }


        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}
