require.config({
	deps: ["main"],
	paths: {
		"require": "lib/requirejs/require",
		"cs": "lib/require-cs/cs",
		"text": "lib/requirejs-text/text",
		"pico": "libN/node-pico/pico",
		"raphael": "lib/raphael/raphael"
	},
	packages: [{
	    "name": "cs",
	    "location": "lib/require-cs",
	    "main": "cs"
	   },{
      "name": "coffee-script",
	  	"location": "lib/coffee-script",
	    "main": "index"
	}],
});
