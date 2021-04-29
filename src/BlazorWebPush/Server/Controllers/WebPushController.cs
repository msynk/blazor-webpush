using BlazorWebPush.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebPush;

namespace BlazorWebPush.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebPushController : ControllerBase
    {
        private static List<NotificationSubscription> _subscriptions = new List<NotificationSubscription>();

        private readonly IConfiguration _configuration;

        public WebPushController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public List<NotificationSubscription> Get()
        {
            return _subscriptions;
        }

        [HttpPost]
        public void Post(NotificationSubscription subscription)
        {
            _subscriptions.Add(subscription);
        }

        [HttpPut]
        public async Task Put(NotificationSubscription sub)
        {
            var subscription = new PushSubscription(sub.EndPoint, sub.P256dh, sub.Auth);

            var message = "this is from WebPush";

            var subject = _configuration["vapid:subject"];
            var publicKey = _configuration["vapid:publicKey"];
            var privateKey = _configuration["vapid:privateKey"];
            var vapidDetails = new VapidDetails(subject, publicKey, privateKey);

            var webPushClient = new WebPushClient();
            await webPushClient.SendNotificationAsync(subscription, message, vapidDetails);
        }
    }
}
