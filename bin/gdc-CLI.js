#! /usr/bin/env node

//var fs = require('fs');
var fse = require('fs-extra');
var _ = require('lodash');

var CMD_INIT = "init"
var CMD_APPLY = "apply";
var CMD_UPDATE = "update";
var CMD_PURGE = "purge";
var CMD_ADD = "add";
var CMD_REMOVE = "remove";

var PATH_CONFIG_DIR = ".geodesic";

var user_args = process.argv.slice(2);

if (user_args.length === 0)
{
	print_help_general();
	return;
}

var sub_cmd = user_args[0];

switch (sub_cmd)
{
	case CMD_INIT:
	handle_cmd_init(user_args.slice(1));
	break;
	
	case CMD_APPLY:
	handle_cmd_apply(user_args.slice(1));
	break;
	
	case CMD_UPDATE:
	handle_cmd_update(user_args.slice(1));
	break;
	
	case CMD_PURGE:
	break;
	
	case CMD_ADD:
	handle_cmd_add(user_args.slice(1));
	break;
	
	default:
	break;
}

function handle_cmd_init(args)
{
	if (directory_exists(PATH_CONFIG_DIR))
	{
		console.log("gdc target directory already exists");
	}
	else
	{
		fs.mkdirSync(PATH_CONFIG_DIR);
		console.log("gdc target directory created");
	}
}

function handle_cmd_add(args)
{
	if (args.length !== 1)
	{
		console.log("TODO HELP add < target-name >");
		return;
	}
	
	var target_name = args[0];
	
	var json_path = PATH_CONFIG_DIR + '/' + target_name + ".json";
	var js_path = PATH_CONFIG_DIR + '/' + target_name + ".js";
	
	fse.readJson('./package.json', 
	function (err, pkg)
	{
		if (err || !pkg)
		{
			console.log(err);
			return;
		}
						
		var target_json = 
		{
			module_name: pkg.name
		};
										
		if (pkg.dependencies)
			target_json.dependencies = {};
		
		write_json(json_path, target_json, 
		function (err)
		{
			console.log(err)
		});
	});
}

function handle_cmd_apply(args)
{
	if (user_args.length < 2)
	{
		print_help_install();
		return;
	}
		
	var target_name = user_args[1];
	
	console.log("installing target: " + target_name);
				
	var json_path = PATH_CONFIG_DIR + '/' + target_name + ".json";
	var js_path = PATH_CONFIG_DIR + '/' + target_name + ".js";
	
	fse.readJson('./package.json', 
	function (err, pkg)
	{
		if (err || !pkg)
		{
			console.log(err);
			return;
		}
		
		fse.readJson(json_path, 
		function (e2, target_json)
		{
			if (target_json.dependencies)
			{
				// TODO: filter package command arguments
				_.merge(pkg.dependencies, target_json.dependencies);
			}
			
			write_json('./package.json', pkg, 
			function (err)
			{
				console.log(err)
			});
		});
	});
}

function handle_cmd_update(args)
{
	if (user_args.length < 2)
	{
		print_help_publish();
		return;
	}
		
	var target_name = user_args[1];
		
	console.log("publishing target: " + target_name);
				
	var json_path = PATH_CONFIG_DIR + '/' + target_name + ".json";
	var js_path = PATH_CONFIG_DIR + '/' + target_name + ".js";
	
	fse.readJson('./package.json', 
	function (err, pkg)
	{
		if (err || !pkg)
		{
			console.log(err);
			return;
		}
		
		fse.readJson(json_path, 
		function (e2, target_json)
		{
			if (pkg.dependencies)
			{
				// TODO: filter package command arguments
				target_json.dependencies = pkg.dependencies;
			}
			
			write_json(json_path, target_json, 
			function (err)
			{
				console.log(err)
			});
		});
	});
}

function write_json(file, data, cb)
{
	fse.writeFile(file, JSON.stringify(data, null, 4), cb);
}

function directory_exists(path)
{
	try
	{
		// Query the entry
		stats = fs.statSync(path);

		// Is it a directory?
		return stats.isDirectory();
	}
	catch (e)
	{
		return false;
	}
	
	return false;
}

function file_exists(path)
{
	try
	{
		// Query the entry
		stats = fs.statSync(path);
		
		// Is it a file?
		return stats.isFile();
	}
	catch (e)
	{
		return false;
	}
	
	return false;
}

function print_help_general()
{
	console.log();
	console.log("gdc - usage:");
	console.log();
	console.log("	gdc init");
	console.log("	gdc install < target > [ packages, ... ]");
	console.log("	gdc publish < target > [ packages, ... ]");
	console.log("	gdc purge < target > | *");
}

function print_help_install()
{
	console.log();
	console.log("gdc install - usage:");
	console.log();
	console.log("	gdc install < target > [ packages, ... ]");
}

function print_help_publish()
{
	console.log();
	console.log("gdc publish - usage:");
	console.log();
	console.log("	gdc publish < target > [ packages, ... ]");
}
