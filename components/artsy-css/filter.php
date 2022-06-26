<?php header( 'Content-type: image/svg+xml' ); ?>
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="wow">
      <feTurbulence type="fractalNoise" seed="<?=mt_rand(1, 1000)?>" numOctaves="200" baseFrequency=".005"/>
      <feDisplacementMap in="SourceGraphic" scale="500"/>
    </filter>
  </defs>
</svg>