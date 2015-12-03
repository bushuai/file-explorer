var fs = require('fs'),
  stdin = process.stdin,
  stdout = process.stdout,
  stats = [];


fs.readdir(process.cwd(), function (err, files) {
  console.log('');
  if (!files.length) {
    return 'No file(s) to show.'
  }
  console.log(' select which file or directory you want to see \n ');

  function read() {
    console.log('');
    process.stdout.write(' \033[33m Enter your choice : \033[39m');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    stdin.on('data', option)
  }

  function option(data) {
    var filename = files[Number(data)];
    if (!filename) {
      stdout.write('\033[31m Enter your choice : \033[39m')
    } else {
      stdin.pause();
      if (stats[Number(data)].isDirectory()) {
        fs.readdir(__dirname + '/' + filename, function (err, files) {
          if (!files.length) {
            return 'No file(s) to show.';
          }
          console.log('');
          console.log(' (' + files.length + ') files');
          files.forEach(function (file) {
            console.log('  - ' + file);
          });
          console.log('');
        });
      } else {
        fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
          console.log('');
          console.log('\033[31m ' + data.replace(/(.*)/g, '    $1') + ' \033[39m');
        });
      }
    }
  }

  function file(i) {
    filename = files[i];
    fs.stat(__dirname + '/' + filename, function (err, stat) {
      stats[i] = stat;
      if (stat.isDirectory()) {
        console.log(' ' + i + ' \033[36m' + filename + ' /\033[39m')
      } else {
        console.log(' ' + i + ' \033[90m' + filename + ' /\033[39m')
      }
      if (++i == files.length) {
        read();
      } else {
        file(i);
      }
    });
  }
  file(0);
});
