var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var nodemon = require("gulp-nodemon");
var browsersync = require("browser-sync");
var plumber = require("gulp-plumber");
var beeper = require("beepbeep");
var sourcemaps = require("gulp-sourcemaps");

function onError(error) {
	beeper();
	console.log("Sass error has occurred");
}

gulp.task("browsersync", function(callback){
	return browsersync({
		server: {
			baseDir: "./public/"
		}
	}, callback)
});

gulp.task("styles", function(){
	return gulp.src("app/css/*.scss")
			   .pipe(plumber({
			   		errorHandler: onError
			   }))
			   .pipe(sass())
			   .pipe(gulp.dest("public/stylesheets"));
});

gulp.task("scripts", function(){
	return gulp.src("app/js/*.js")
			   .pipe(sourcemaps.init())
			   .pipe(jshint())
			   .pipe(jshint.reporter("default"))
			   .pipe(concat("all.js"))
			   .pipe(uglify())
			   .pipe(sourcemaps.write("maps"))
			   .pipe(gulp.dest("public/javascripts"));
});

gulp.task("images", function(){
	return gulp.src("app/images/*")
			   .pipe(imagemin())
			   .pipe(gulp.dest("public/images"));
});

gulp.task("watch", function(){
	gulp.watch("app/css/*.scss", ["styles", browsersync.reload]);
	gulp.watch("app/js/*.js", ["scripts", browsersync.reload]);
	gulp.watch("app/images/*", ["images", browsersync.reload]);
});

gulp.task("develop", function(){
	var stream = nodemon({
		script: "server.js",
		tasks: ["watch", "styles", "scripts", "images", "browsersync"]
	});

	stream.on("crash", function(){
		console.log("Server Crashed. Restarting in 5 seconds");
		stream.emit("restart", 5)
	});
});

gulp.task("default", ["develop"]);