#!/usr/bin/env node

"use strict";
exports.__esModule = true;
exports.nextBuild = void 0;
var _fs = require( "fs" );
var _index = _interopRequireDefault( require( "next/dist/compiled/arg/index.js" ) );
var _path = require( "path" );
var _build = _interopRequireDefault( require( "../build" ) );
var _utils = require( "../server/lib/utils" );
var _findPagesDir = require( "../lib/find-pages-dir" );

function _interopRequireDefault( obj ) {
  return obj && obj.__esModule ? obj :
    {
      default: obj
    };
}
const nextBuild = argv => {
  const args = ( 0, _index.default )(
    { // Types
      '--help': Boolean,
      '--pagesDir': String, // Aliases
      '-h': '--help'
    },
    {
      argv
    } );
  if ( args['--help'] ) {
    ( 0, _utils.printAndExit )( `
      Description
        Compiles the application for production deployment

      Options
        --pagesDir      Location of pages dir

      Usage
        $ next build <dir>

      <dir> represents where the compiled dist folder should go.
      If no directory is provided, the dist folder will be created in the current directory.
      You can set a custom folder in config https://github.com/zeit/next.js#custom-configuration, otherwise it will be created inside '.next'
    `, 0 );
  }
  const dir = ( 0, _path.resolve )( '.' );
  const destDir = ( 0, _path.resolve )( args._[0] || '.' );

  args['--pagesDir'] && ( 0, _findPagesDir.setPagesDir )( ( 0, _path.join )( ( 0, _path.resolve )( '.' ), args['--pagesDir'] ) ); // Check if the provided directory exists

  if ( !( 0, _fs.existsSync )( dir ) ) {
    ( 0, _utils.printAndExit )( `> No such directory exists as the project root: ${dir}` );
  } ( 0, _build.default )( dir, null, destDir ).then( () => process.exit( 0 ) ).catch( err => {
    console.error( '' );
    console.error( '> Build error occurred' );
    ( 0, _utils.printAndExit )( err );
  } );
};
exports.nextBuild = nextBuild;