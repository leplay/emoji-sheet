<?php
	# apple images are too big to composite at speed, so we'll make 64px
	# versions from the 160px source.

	shell_exec("rm -f ../../source/img-apple-64/*.png");

	$files = glob("../../source/img-apple-160/*.png");

	foreach ($files as $src){

		$bits = explode('/', $src);
		$final = array_pop($bits);
		// if (strpos($final, 'UNKNOWN')) continue;

		$dst = '../../source/img-apple-64/'.$final;

		exec("convert {$src} -resize 64x64 png32:{$dst}", $out, $code);

		if ($code){
			echo "ERROR:\n";
			echo "   ".$out."\n";
		}else{
			echo ".";
		}
	}

	echo "All done\n";
