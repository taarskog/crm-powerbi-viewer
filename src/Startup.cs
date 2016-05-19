namespace Web
{
	using Microsoft.AspNet.Builder;
	using Microsoft.AspNet.Hosting;
	using Microsoft.AspNet.Http;
	using Microsoft.Extensions.DependencyInjection;

	public class Startup
	{
		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services)
		{
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app)
		{
			app.UseIISPlatformHandler();

			app.UseStaticFiles();
			app.UseStaticFiles("/webresources/his_");

			app.Run(async (context) =>
			{
				await context.Response.WriteAsync("<html><body><h1>No static file found mathing the request!</h1><div>You probably tried to go <a href='/powerBiConfig.html'>here</a></div></body></html>");
			});
		}

		// Entry point for the application.
		public static void Main(string[] args) => WebApplication.Run<Startup>(args);
	}
}
