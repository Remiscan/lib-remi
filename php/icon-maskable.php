<?php
// Takes an SVG icon which had a 10% margin cut off around it, and make it whole.
header('Content-Type: image/svg+xml');
$url = (isset($_GET['icon'])) ? dirname(__DIR__, 2).'/'.$_GET['icon'] : __DIR__.'/icon.svg';

ob_start();
include $url;
$svg = ob_get_clean();

$svg = str_replace('viewBox="51.2 51.2 409.6 409.6"', 'viewBox="0 0 512 512"', $svg);
echo $svg;