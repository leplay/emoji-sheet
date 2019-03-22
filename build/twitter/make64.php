<?php
  # Same code as apple/make64.php
  # versions from the 72px source.

  shell_exec("rm -f ../../source/img-twitter-64/*.png");

  $files = glob("./img-twitter-72/*.png");

  foreach ($files as $src){

    $bits = explode('/', $src);
    $final = array_pop($bits);
    // if (strpos($final, 'UNKNOWN')) continue;

    $dst = '../../source/img-twitter-64/'.$final;

    exec("convert {$src} -resize 64x64 png32:{$dst}", $out, $code);

    if ($code){
      echo "ERROR:\n";
      echo "   ".$out."\n";
    }else{
      echo ".";
    }
  }

  echo "All done\n";
