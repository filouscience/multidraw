<?php

$swap_file = "multidraw_history.xml";
if(!file_exists($swap_file))
  return;

$q = $_GET["q"];

if($q == "d")                                                                                       // clear the file
  {
    $fp = fopen($swap_file,"w") or die("can't open file");
    fwrite($fp,"<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n<history>\n\n</history>");
    fclose($fp);
  }
elseif($q == "a")                                                                                   // add new command (move+draw)
  {                                                                                                 // hope the command string ($line[2]) does not everflow
    $line = file($swap_file,FILE_IGNORE_NEW_LINES);
    $fp = fopen($swap_file,"w") or die("can't open file");
    $str = $_GET["history"];
    $cmd = $line[2].$str;
    fwrite($fp, "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n<history>\n".$cmd."\n</history>\n");
    fclose($fp);
  }

echo count($line);

?>