/**
 * @package supercop.wasm
 * @author  Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license 0BSD
 */
exec		= require('child_process').exec
glob		= require('glob')
gulp		= require('gulp')
rename		= require('gulp-rename')
uglify		= require('gulp-uglify')

gulp
	.task('build', ['wasm', 'minify'])
	.task('wasm', (callback) !->
		files		= glob.sync('vendor/src/*.c').join(' ')
		functions	= JSON.stringify([
			'_malloc'
			'_free'
			'_ed25519_create_keypair'
			'_ed25519_sign'
			'_ed25519_verify'
			'_ed25519_get_publickey'
		])
		# Options that are only specified to optimize resulting file size and basically remove unused features
		optimize	= "-Oz --llvm-lto 1 --closure 1 -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS=[] -s DEFAULT_LIBRARY_FUNCS_TO_INCLUDE=[]"
		command		= "emcc src/supercop.c #files --post-js src/bytes_allocation.js -o src/supercop.js -s MODULARIZE=1 -s 'EXPORT_NAME=\"__supercopwasm\"' -s EXPORTED_FUNCTIONS='#functions' -s WASM=1 #optimize"
		exec(command, (error, stdout, stderr) !->
			if stdout
				console.log(stdout)
			if stderr
				console.error(stderr)
			callback(error)
		)
	)
	.task('minify', ->
		gulp.src("src/index.js")
			.pipe(uglify())
			.pipe(rename(
				suffix: '.min'
			))
			.pipe(gulp.dest('src'))
	)
