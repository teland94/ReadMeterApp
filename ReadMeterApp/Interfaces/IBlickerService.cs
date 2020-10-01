using System.Threading.Tasks;
using ReadMeterApp.Models;

namespace ReadMeterApp.Interfaces
{
    public interface IBlickerService
    {
        Task<BlickerResult> Read(byte[] image, string language);

        Task<AliveResult> Alive();
    }
}