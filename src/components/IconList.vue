<template>
  <div>
    <div class="row p-2" id="icon_zone" v-on:click.stop="iconClick">
      <div class="col-md-4 form-inline">
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-address-book"></i>
          <span class="text-inverse">address-book</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-address-card"></i>
          <span class="text-inverse">address-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-adjust"></i>
          <span class="text-inverse">adjust</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-align-center"></i>
          <span class="text-inverse">align-center</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-align-justify"></i>
          <span class="text-inverse">align-justify</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-align-left"></i>
          <span class="text-inverse">align-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-align-right"></i>
          <span class="text-inverse">align-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ambulance"></i>
          <span class="text-inverse">ambulance</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-american-sign-language-interpreting"></i>
          <span class="text-inverse">american-sign-language-interpreting</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-anchor"></i>
          <span class="text-inverse">anchor</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-double-down"></i>
          <span class="text-inverse">angle-double-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-double-left"></i>
          <span class="text-inverse">angle-double-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-double-right"></i>
          <span class="text-inverse">angle-double-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-double-up"></i>
          <span class="text-inverse">angle-double-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-down"></i>
          <span class="text-inverse">angle-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-left"></i>
          <span class="text-inverse">angle-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-right"></i>
          <span class="text-inverse">angle-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-angle-up"></i>
          <span class="text-inverse">angle-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-archive"></i>
          <span class="text-inverse">archive</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-alt-circle-down"></i>
          <span class="text-inverse">arrow-alt-circle-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-alt-circle-left"></i>
          <span class="text-inverse">arrow-alt-circle-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-alt-circle-right"></i>
          <span class="text-inverse">arrow-alt-circle-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-alt-circle-up"></i>
          <span class="text-inverse">arrow-alt-circle-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-circle-down"></i>
          <span class="text-inverse">arrow-circle-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-circle-left"></i>
          <span class="text-inverse">arrow-circle-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-circle-right"></i>
          <span class="text-inverse">arrow-circle-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-circle-up"></i>
          <span class="text-inverse">arrow-circle-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-down"></i>
          <span class="text-inverse">arrow-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-left"></i>
          <span class="text-inverse">arrow-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-right"></i>
          <span class="text-inverse">arrow-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrow-up"></i>
          <span class="text-inverse">arrow-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrows-alt"></i>
          <span class="text-inverse">arrows-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrows-alt-h"></i>
          <span class="text-inverse">arrows-alt-h</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-arrows-alt-v"></i>
          <span class="text-inverse">arrows-alt-v</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-assistive-listening-systems"></i>
          <span class="text-inverse">assistive-listening-systems</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-asterisk"></i>
          <span class="text-inverse">asterisk</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-at"></i> <span class="text-inverse">at</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-audio-description"></i>
          <span class="text-inverse">audio-description</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-backward"></i>
          <span class="text-inverse">backward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-balance-scale"></i>
          <span class="text-inverse">balance-scale</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-ban"></i> <span class="text-inverse">ban</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-barcode"></i>
          <span class="text-inverse">barcode</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bars"></i>
          <span class="text-inverse">bars</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bath"></i>
          <span class="text-inverse">bath</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-battery-empty"></i>
          <span class="text-inverse">battery-empty</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-battery-full"></i>
          <span class="text-inverse">battery-full</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-battery-half"></i>
          <span class="text-inverse">battery-half</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-battery-quarter"></i>
          <span class="text-inverse">battery-quarter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-battery-three-quarters"></i>
          <span class="text-inverse">battery-three-quarters</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-bed"></i> <span class="text-inverse">bed</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-beer"></i>
          <span class="text-inverse">beer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bell"></i>
          <span class="text-inverse">bell</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bell-slash"></i>
          <span class="text-inverse">bell-slash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bicycle"></i>
          <span class="text-inverse">bicycle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-binoculars"></i>
          <span class="text-inverse">binoculars</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-birthday-cake"></i>
          <span class="text-inverse">birthday-cake</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-blind"></i>
          <span class="text-inverse">blind</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bold"></i>
          <span class="text-inverse">bold</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bolt"></i>
          <span class="text-inverse">bolt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bomb"></i>
          <span class="text-inverse">bomb</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-book"></i>
          <span class="text-inverse">book</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bookmark"></i>
          <span class="text-inverse">bookmark</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-braille"></i>
          <span class="text-inverse">braille</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-briefcase"></i>
          <span class="text-inverse">briefcase</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-bug"></i> <span class="text-inverse">bug</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-building"></i>
          <span class="text-inverse">building</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bullhorn"></i>
          <span class="text-inverse">bullhorn</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-bullseye"></i>
          <span class="text-inverse">bullseye</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-bus"></i> <span class="text-inverse">bus</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calculator"></i>
          <span class="text-inverse">calculator</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar"></i>
          <span class="text-inverse">calendar</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar-alt"></i>
          <span class="text-inverse">calendar-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar-check"></i>
          <span class="text-inverse">calendar-check</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar-minus"></i>
          <span class="text-inverse">calendar-minus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar-plus"></i>
          <span class="text-inverse">calendar-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-calendar-times"></i>
          <span class="text-inverse">calendar-times</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-camera"></i>
          <span class="text-inverse">camera</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-camera-retro"></i>
          <span class="text-inverse">camera-retro</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-car"></i> <span class="text-inverse">car</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-down"></i>
          <span class="text-inverse">caret-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-left"></i>
          <span class="text-inverse">caret-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-right"></i>
          <span class="text-inverse">caret-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-square-down"></i>
          <span class="text-inverse">caret-square-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-square-left"></i>
          <span class="text-inverse">caret-square-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-square-right"></i>
          <span class="text-inverse">caret-square-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-square-up"></i>
          <span class="text-inverse">caret-square-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-caret-up"></i>
          <span class="text-inverse">caret-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cart-arrow-down"></i>
          <span class="text-inverse">cart-arrow-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cart-plus"></i>
          <span class="text-inverse">cart-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-certificate"></i>
          <span class="text-inverse">certificate</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chart-area"></i>
          <span class="text-inverse">chart-area</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chart-bar"></i>
          <span class="text-inverse">chart-bar</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chart-line"></i>
          <span class="text-inverse">chart-line</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chart-pie"></i>
          <span class="text-inverse">chart-pie</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-check"></i>
          <span class="text-inverse">check</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-check-circle"></i>
          <span class="text-inverse">check-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-check-square"></i>
          <span class="text-inverse">check-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-circle-down"></i>
          <span class="text-inverse">chevron-circle-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-circle-left"></i>
          <span class="text-inverse">chevron-circle-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-circle-right"></i>
          <span class="text-inverse">chevron-circle-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-circle-up"></i>
          <span class="text-inverse">chevron-circle-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-down"></i>
          <span class="text-inverse">chevron-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-left"></i>
          <span class="text-inverse">chevron-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-right"></i>
          <span class="text-inverse">chevron-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-chevron-up"></i>
          <span class="text-inverse">chevron-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-child"></i>
          <span class="text-inverse">child</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-circle"></i>
          <span class="text-inverse">circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-circle-notch"></i>
          <span class="text-inverse">circle-notch</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-clipboard"></i>
          <span class="text-inverse">clipboard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-clock"></i>
          <span class="text-inverse">clock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-clone"></i>
          <span class="text-inverse">clone</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-closed-captioning"></i>
          <span class="text-inverse">closed-captioning</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cloud"></i>
          <span class="text-inverse">cloud</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cloud-download-alt"></i>
          <span class="text-inverse">cloud-download-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cloud-upload-alt"></i>
          <span class="text-inverse">cloud-upload-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-code"></i>
          <span class="text-inverse">code</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-code-branch"></i>
          <span class="text-inverse">code-branch</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-coffee"></i>
          <span class="text-inverse">coffee</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-cog"></i> <span class="text-inverse">cog</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cogs"></i>
          <span class="text-inverse">cogs</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-columns"></i>
          <span class="text-inverse">columns</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-comment"></i>
          <span class="text-inverse">comment</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-comment-alt"></i>
          <span class="text-inverse">comment-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-comments"></i>
          <span class="text-inverse">comments</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-compass"></i>
          <span class="text-inverse">compass</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-compress"></i>
          <span class="text-inverse">compress</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-copy"></i>
          <span class="text-inverse">copy</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-copyright"></i>
          <span class="text-inverse">copyright</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-credit-card"></i>
          <span class="text-inverse">credit-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-crop"></i>
          <span class="text-inverse">crop</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-crosshairs"></i>
          <span class="text-inverse">crosshairs</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cube"></i>
          <span class="text-inverse">cube</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-cubes"></i>
          <span class="text-inverse">cubes</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-cut"></i> <span class="text-inverse">cut</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-database"></i>
          <span class="text-inverse">database</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-deaf"></i>
          <span class="text-inverse">deaf</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-desktop"></i>
          <span class="text-inverse">desktop</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-dollar-sign"></i>
          <span class="text-inverse">dollar-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-dot-circle"></i>
          <span class="text-inverse">dot-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-download"></i>
          <span class="text-inverse">download</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-edit"></i>
          <span class="text-inverse">edit</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-eject"></i>
          <span class="text-inverse">eject</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ellipsis-h"></i>
          <span class="text-inverse">ellipsis-h</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ellipsis-v"></i>
          <span class="text-inverse">ellipsis-v</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-envelope"></i>
          <span class="text-inverse">envelope</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-envelope-open"></i>
          <span class="text-inverse">envelope-open</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-envelope-square"></i>
          <span class="text-inverse">envelope-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-eraser"></i>
          <span class="text-inverse">eraser</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-euro-sign"></i>
          <span class="text-inverse">euro-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-exchange-alt"></i>
          <span class="text-inverse">exchange-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-exclamation"></i>
          <span class="text-inverse">exclamation</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-exclamation-circle"></i>
          <span class="text-inverse">exclamation-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-exclamation-triangle"></i>
          <span class="text-inverse">exclamation-triangle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-expand"></i>
          <span class="text-inverse">expand</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-expand-arrows-alt"></i>
          <span class="text-inverse">expand-arrows-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-external-link-alt"></i>
          <span class="text-inverse">external-link-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-external-link-square-alt"></i>
          <span class="text-inverse">external-link-square-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-eye"></i> <span class="text-inverse">eye</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-eye-dropper"></i>
          <span class="text-inverse">eye-dropper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-eye-slash"></i>
          <span class="text-inverse">eye-slash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-fast-backward"></i>
          <span class="text-inverse">fast-backward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-fast-forward"></i>
          <span class="text-inverse">fast-forward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-fax"></i> <span class="text-inverse">fax</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-female"></i>
          <span class="text-inverse">female</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-fighter-jet"></i>
          <span class="text-inverse">fighter-jet</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file"></i>
          <span class="text-inverse">file</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-alt"></i>
          <span class="text-inverse">file-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-archive"></i>
          <span class="text-inverse">file-archive</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-audio"></i>
          <span class="text-inverse">file-audio</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-code"></i>
          <span class="text-inverse">file-code</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-excel"></i>
          <span class="text-inverse">file-excel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-image"></i>
          <span class="text-inverse">file-image</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-pdf"></i>
          <span class="text-inverse">file-pdf</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-powerpoint"></i>
          <span class="text-inverse">file-powerpoint</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-video"></i>
          <span class="text-inverse">file-video</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-file-word"></i>
          <span class="text-inverse">file-word</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-film"></i>
          <span class="text-inverse">film</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-filter"></i>
          <span class="text-inverse">filter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-fire"></i>
          <span class="text-inverse">fire</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-fire-extinguisher"></i>
          <span class="text-inverse">fire-extinguisher</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-flag"></i>
          <span class="text-inverse">flag</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-flag-checkered"></i>
          <span class="text-inverse">flag-checkered</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-flask"></i>
          <span class="text-inverse">flask</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-folder"></i>
          <span class="text-inverse">folder</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-folder-open"></i>
          <span class="text-inverse">folder-open</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-font"></i>
          <span class="text-inverse">font</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-forward"></i>
          <span class="text-inverse">forward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-frown"></i>
          <span class="text-inverse">frown</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-futbol"></i>
          <span class="text-inverse">futbol</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-gamepad"></i>
          <span class="text-inverse">gamepad</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-gavel"></i>
          <span class="text-inverse">gavel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-gem"></i> <span class="text-inverse">gem</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-genderless"></i>
          <span class="text-inverse">genderless</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-gift"></i>
          <span class="text-inverse">gift</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-glass-martini"></i>
          <span class="text-inverse">glass-martini</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-globe"></i>
          <span class="text-inverse">globe</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-graduation-cap"></i>
          <span class="text-inverse">graduation-cap</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-h-square"></i>
          <span class="text-inverse">h-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-lizard"></i>
          <span class="text-inverse">hand-lizard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-paper"></i>
          <span class="text-inverse">hand-paper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-peace"></i>
          <span class="text-inverse">hand-peace</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-point-down"></i>
          <span class="text-inverse">hand-point-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-point-left"></i>
          <span class="text-inverse">hand-point-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-point-right"></i>
          <span class="text-inverse">hand-point-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-point-up"></i>
          <span class="text-inverse">hand-point-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-pointer"></i>
          <span class="text-inverse">hand-pointer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-rock"></i>
          <span class="text-inverse">hand-rock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-scissors"></i>
          <span class="text-inverse">hand-scissors</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hand-spock"></i>
          <span class="text-inverse">hand-spock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-handshake"></i>
          <span class="text-inverse">handshake</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hashtag"></i>
          <span class="text-inverse">hashtag</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-hdd"></i> <span class="text-inverse">hdd</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-heading"></i>
          <span class="text-inverse">heading</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-headphones"></i>
          <span class="text-inverse">headphones</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-heart"></i>
          <span class="text-inverse">heart</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-heartbeat"></i>
          <span class="text-inverse">heartbeat</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-history"></i>
          <span class="text-inverse">history</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-home"></i>
          <span class="text-inverse">home</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hospital"></i>
          <span class="text-inverse">hospital</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hourglass"></i>
          <span class="text-inverse">hourglass</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hourglass-end"></i>
          <span class="text-inverse">hourglass-end</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hourglass-half"></i>
          <span class="text-inverse">hourglass-half</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-hourglass-start"></i>
          <span class="text-inverse">hourglass-start</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-i-cursor"></i>
          <span class="text-inverse">i-cursor</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-id-badge"></i>
          <span class="text-inverse">id-badge</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-id-card"></i>
          <span class="text-inverse">id-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-image"></i>
          <span class="text-inverse">image</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-images"></i>
          <span class="text-inverse">images</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-inbox"></i>
          <span class="text-inverse">inbox</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-indent"></i>
          <span class="text-inverse">indent</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-industry"></i>
          <span class="text-inverse">industry</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-info"></i>
          <span class="text-inverse">info</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-info-circle"></i>
          <span class="text-inverse">info-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-italic"></i>
          <span class="text-inverse">italic</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-key"></i> <span class="text-inverse">key</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-keyboard"></i>
          <span class="text-inverse">keyboard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-language"></i>
          <span class="text-inverse">language</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-laptop"></i>
          <span class="text-inverse">laptop</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-leaf"></i>
          <span class="text-inverse">leaf</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-lemon"></i>
          <span class="text-inverse">lemon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-level-down-alt"></i>
          <span class="text-inverse">level-down-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-level-up-alt"></i>
          <span class="text-inverse">level-up-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-life-ring"></i>
          <span class="text-inverse">life-ring</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-lightbulb"></i>
          <span class="text-inverse">lightbulb</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-link"></i>
          <span class="text-inverse">link</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-lira-sign"></i>
          <span class="text-inverse">lira-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-list"></i>
          <span class="text-inverse">list</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-list-alt"></i>
          <span class="text-inverse">list-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-list-ol"></i>
          <span class="text-inverse">list-ol</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-list-ul"></i>
          <span class="text-inverse">list-ul</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-location-arrow"></i>
          <span class="text-inverse">location-arrow</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-lock"></i>
          <span class="text-inverse">lock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-lock-open"></i>
          <span class="text-inverse">lock-open</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-long-arrow-alt-down"></i>
          <span class="text-inverse">long-arrow-alt-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-long-arrow-alt-left"></i>
          <span class="text-inverse">long-arrow-alt-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-long-arrow-alt-right"></i>
          <span class="text-inverse">long-arrow-alt-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-long-arrow-alt-up"></i>
          <span class="text-inverse">long-arrow-alt-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-low-vision"></i>
          <span class="text-inverse">low-vision</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-magic"></i>
          <span class="text-inverse">magic</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-magnet"></i>
          <span class="text-inverse">magnet</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-male"></i>
          <span class="text-inverse">male</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-map"></i> <span class="text-inverse">map</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-map-marker"></i>
          <span class="text-inverse">map-marker</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-map-marker-alt"></i>
          <span class="text-inverse">map-marker-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-map-pin"></i>
          <span class="text-inverse">map-pin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-map-signs"></i>
          <span class="text-inverse">map-signs</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mars"></i>
          <span class="text-inverse">mars</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mars-double"></i>
          <span class="text-inverse">mars-double</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mars-stroke"></i>
          <span class="text-inverse">mars-stroke</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mars-stroke-h"></i>
          <span class="text-inverse">mars-stroke-h</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mars-stroke-v"></i>
          <span class="text-inverse">mars-stroke-v</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-medkit"></i>
          <span class="text-inverse">medkit</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-meh"></i> <span class="text-inverse">meh</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mercury"></i>
          <span class="text-inverse">mercury</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-microchip"></i>
          <span class="text-inverse">microchip</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-microphone"></i>
          <span class="text-inverse">microphone</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-microphone-slash"></i>
          <span class="text-inverse">microphone-slash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-minus"></i>
          <span class="text-inverse">minus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-minus-circle"></i>
          <span class="text-inverse">minus-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-minus-square"></i>
          <span class="text-inverse">minus-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mobile"></i>
          <span class="text-inverse">mobile</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mobile-alt"></i>
          <span class="text-inverse">mobile-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-money-bill-alt"></i>
          <span class="text-inverse">money-bill-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-moon"></i>
          <span class="text-inverse">moon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-motorcycle"></i>
          <span class="text-inverse">motorcycle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-mouse-pointer"></i>
          <span class="text-inverse">mouse-pointer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-music"></i>
          <span class="text-inverse">music</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-neuter"></i>
          <span class="text-inverse">neuter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-newspaper"></i>
          <span class="text-inverse">newspaper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-object-group"></i>
          <span class="text-inverse">object-group</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-object-ungroup"></i>
          <span class="text-inverse">object-ungroup</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-outdent"></i>
          <span class="text-inverse">outdent</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-paint-brush"></i>
          <span class="text-inverse">paint-brush</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-paper-plane"></i>
          <span class="text-inverse">paper-plane</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-paperclip"></i>
          <span class="text-inverse">paperclip</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-paragraph"></i>
          <span class="text-inverse">paragraph</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-paste"></i>
          <span class="text-inverse">paste</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-pause"></i>
          <span class="text-inverse">pause</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-pause-circle"></i>
          <span class="text-inverse">pause-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-paw"></i> <span class="text-inverse">paw</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-pen-square"></i>
          <span class="text-inverse">pen-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-pencil-alt"></i>
          <span class="text-inverse">pencil-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-percent"></i>
          <span class="text-inverse">percent</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-phone"></i>
          <span class="text-inverse">phone</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-phone-square"></i>
          <span class="text-inverse">phone-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-phone-volume"></i>
          <span class="text-inverse">phone-volume</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-plane"></i>
          <span class="text-inverse">plane</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-play"></i>
          <span class="text-inverse">play</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-play-circle"></i>
          <span class="text-inverse">play-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-plug"></i>
          <span class="text-inverse">plug</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-plus"></i>
          <span class="text-inverse">plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-plus-circle"></i>
          <span class="text-inverse">plus-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-plus-square"></i>
          <span class="text-inverse">plus-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-podcast"></i>
          <span class="text-inverse">podcast</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-pound-sign"></i>
          <span class="text-inverse">pound-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-power-off"></i>
          <span class="text-inverse">power-off</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-print"></i>
          <span class="text-inverse">print</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-puzzle-piece"></i>
          <span class="text-inverse">puzzle-piece</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-qrcode"></i>
          <span class="text-inverse">qrcode</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-question"></i>
          <span class="text-inverse">question</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-question-circle"></i>
          <span class="text-inverse">question-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-quote-left"></i>
          <span class="text-inverse">quote-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-quote-right"></i>
          <span class="text-inverse">quote-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-random"></i>
          <span class="text-inverse">random</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-recycle"></i>
          <span class="text-inverse">recycle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-redo"></i>
          <span class="text-inverse">redo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-redo-alt"></i>
          <span class="text-inverse">redo-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-registered"></i>
          <span class="text-inverse">registered</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-reply"></i>
          <span class="text-inverse">reply</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-reply-all"></i>
          <span class="text-inverse">reply-all</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-retweet"></i>
          <span class="text-inverse">retweet</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-road"></i>
          <span class="text-inverse">road</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-rocket"></i>
          <span class="text-inverse">rocket</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-rss"></i> <span class="text-inverse">rss</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-rss-square"></i>
          <span class="text-inverse">rss-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ruble-sign"></i>
          <span class="text-inverse">ruble-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-rupee-sign"></i>
          <span class="text-inverse">rupee-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-save"></i>
          <span class="text-inverse">save</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-search"></i>
          <span class="text-inverse">search</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-search-minus"></i>
          <span class="text-inverse">search-minus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-search-plus"></i>
          <span class="text-inverse">search-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-server"></i>
          <span class="text-inverse">server</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-share"></i>
          <span class="text-inverse">share</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-share-alt"></i>
          <span class="text-inverse">share-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-share-alt-square"></i>
          <span class="text-inverse">share-alt-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-share-square"></i>
          <span class="text-inverse">share-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shekel-sign"></i>
          <span class="text-inverse">shekel-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shield-alt"></i>
          <span class="text-inverse">shield-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ship"></i>
          <span class="text-inverse">ship</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shopping-bag"></i>
          <span class="text-inverse">shopping-bag</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shopping-basket"></i>
          <span class="text-inverse">shopping-basket</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shopping-cart"></i>
          <span class="text-inverse">shopping-cart</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-shower"></i>
          <span class="text-inverse">shower</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sign-in-alt"></i>
          <span class="text-inverse">sign-in-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sign-language"></i>
          <span class="text-inverse">sign-language</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sign-out-alt"></i>
          <span class="text-inverse">sign-out-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-signal"></i>
          <span class="text-inverse">signal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sitemap"></i>
          <span class="text-inverse">sitemap</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sliders-h"></i>
          <span class="text-inverse">sliders-h</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-smile"></i>
          <span class="text-inverse">smile</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-snowflake"></i>
          <span class="text-inverse">snowflake</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort"></i>
          <span class="text-inverse">sort</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-alpha-down"></i>
          <span class="text-inverse">sort-alpha-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-alpha-up"></i>
          <span class="text-inverse">sort-alpha-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-amount-down"></i>
          <span class="text-inverse">sort-amount-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-amount-up"></i>
          <span class="text-inverse">sort-amount-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-down"></i>
          <span class="text-inverse">sort-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-numeric-down"></i>
          <span class="text-inverse">sort-numeric-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-numeric-up"></i>
          <span class="text-inverse">sort-numeric-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sort-up"></i>
          <span class="text-inverse">sort-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-space-shuttle"></i>
          <span class="text-inverse">space-shuttle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-spinner"></i>
          <span class="text-inverse">spinner</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-square"></i>
          <span class="text-inverse">square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-star"></i>
          <span class="text-inverse">star</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-star-half"></i>
          <span class="text-inverse">star-half</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-step-backward"></i>
          <span class="text-inverse">step-backward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-step-forward"></i>
          <span class="text-inverse">step-forward</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-stethoscope"></i>
          <span class="text-inverse">stethoscope</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sticky-note"></i>
          <span class="text-inverse">sticky-note</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-stop"></i>
          <span class="text-inverse">stop</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-stop-circle"></i>
          <span class="text-inverse">stop-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-stopwatch"></i>
          <span class="text-inverse">stopwatch</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-street-view"></i>
          <span class="text-inverse">street-view</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-strikethrough"></i>
          <span class="text-inverse">strikethrough</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-subscript"></i>
          <span class="text-inverse">subscript</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-subway"></i>
          <span class="text-inverse">subway</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-suitcase"></i>
          <span class="text-inverse">suitcase</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-sun"></i> <span class="text-inverse">sun</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-superscript"></i>
          <span class="text-inverse">superscript</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sync"></i>
          <span class="text-inverse">sync</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-sync-alt"></i>
          <span class="text-inverse">sync-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-table"></i>
          <span class="text-inverse">table</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tablet"></i>
          <span class="text-inverse">tablet</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tablet-alt"></i>
          <span class="text-inverse">tablet-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tachometer-alt"></i>
          <span class="text-inverse">tachometer-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-tag"></i> <span class="text-inverse">tag</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tags"></i>
          <span class="text-inverse">tags</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tasks"></i>
          <span class="text-inverse">tasks</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-taxi"></i>
          <span class="text-inverse">taxi</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-terminal"></i>
          <span class="text-inverse">terminal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-text-height"></i>
          <span class="text-inverse">text-height</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-text-width"></i>
          <span class="text-inverse">text-width</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-th"></i> <span class="text-inverse">th</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-th-large"></i>
          <span class="text-inverse">th-large</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-th-list"></i>
          <span class="text-inverse">th-list</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thermometer-empty"></i>
          <span class="text-inverse">thermometer-empty</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thermometer-full"></i>
          <span class="text-inverse">thermometer-full</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thermometer-half"></i>
          <span class="text-inverse">thermometer-half</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thermometer-quarter"></i>
          <span class="text-inverse">thermometer-quarter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thermometer-three-quarters"></i>
          <span class="text-inverse">thermometer-three-quarters</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thumbs-down"></i>
          <span class="text-inverse">thumbs-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thumbs-up"></i>
          <span class="text-inverse">thumbs-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-thumbtack"></i>
          <span class="text-inverse">thumbtack</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-ticket-alt"></i>
          <span class="text-inverse">ticket-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-times"></i>
          <span class="text-inverse">times</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-times-circle"></i>
          <span class="text-inverse">times-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tint"></i>
          <span class="text-inverse">tint</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-toggle-off"></i>
          <span class="text-inverse">toggle-off</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-toggle-on"></i>
          <span class="text-inverse">toggle-on</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-trademark"></i>
          <span class="text-inverse">trademark</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-train"></i>
          <span class="text-inverse">train</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-transgender"></i>
          <span class="text-inverse">transgender</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-transgender-alt"></i>
          <span class="text-inverse">transgender-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-trash"></i>
          <span class="text-inverse">trash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-trash-alt"></i>
          <span class="text-inverse">trash-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-tree"></i>
          <span class="text-inverse">tree</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-trophy"></i>
          <span class="text-inverse">trophy</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-truck"></i>
          <span class="text-inverse">truck</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-tty"></i> <span class="text-inverse">tty</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fas fa-fw fa-tv"></i> <span class="text-inverse">tv</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-umbrella"></i>
          <span class="text-inverse">umbrella</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-underline"></i>
          <span class="text-inverse">underline</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-undo"></i>
          <span class="text-inverse">undo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-undo-alt"></i>
          <span class="text-inverse">undo-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-universal-access"></i>
          <span class="text-inverse">universal-access</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-university"></i>
          <span class="text-inverse">university</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-unlink"></i>
          <span class="text-inverse">unlink</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-unlock"></i>
          <span class="text-inverse">unlock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-unlock-alt"></i>
          <span class="text-inverse">unlock-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-upload"></i>
          <span class="text-inverse">upload</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user"></i>
          <span class="text-inverse">user</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user-circle"></i>
          <span class="text-inverse">user-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user-md"></i>
          <span class="text-inverse">user-md</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user-plus"></i>
          <span class="text-inverse">user-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user-secret"></i>
          <span class="text-inverse">user-secret</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-user-times"></i>
          <span class="text-inverse">user-times</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-users"></i>
          <span class="text-inverse">users</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-utensil-spoon"></i>
          <span class="text-inverse">utensil-spoon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-utensils"></i>
          <span class="text-inverse">utensils</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-venus"></i>
          <span class="text-inverse">venus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-venus-double"></i>
          <span class="text-inverse">venus-double</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-venus-mars"></i>
          <span class="text-inverse">venus-mars</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-video"></i>
          <span class="text-inverse">video</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-volume-down"></i>
          <span class="text-inverse">volume-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-volume-off"></i>
          <span class="text-inverse">volume-off</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-volume-up"></i>
          <span class="text-inverse">volume-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-wheelchair"></i>
          <span class="text-inverse">wheelchair</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-wifi"></i>
          <span class="text-inverse">wifi</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-window-close"></i>
          <span class="text-inverse">window-close</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-window-maximize"></i>
          <span class="text-inverse">window-maximize</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-window-minimize"></i>
          <span class="text-inverse">window-minimize</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-window-restore"></i>
          <span class="text-inverse">window-restore</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-won-sign"></i>
          <span class="text-inverse">won-sign</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-wrench"></i>
          <span class="text-inverse">wrench</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fas fa-fw fa-yen-sign"></i>
          <span class="text-inverse">yen-sign</span>
        </div>
      </div>

      <div class="col-md-4 form-inline">
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-address-book"></i>
          <span class="text-inverse">address-book</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-address-card"></i>
          <span class="text-inverse">address-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-arrow-alt-circle-down"></i>
          <span class="text-inverse">arrow-alt-circle-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-arrow-alt-circle-left"></i>
          <span class="text-inverse">arrow-alt-circle-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-arrow-alt-circle-right"></i>
          <span class="text-inverse">arrow-alt-circle-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-arrow-alt-circle-up"></i>
          <span class="text-inverse">arrow-alt-circle-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-bell"></i>
          <span class="text-inverse">bell</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-bell-slash"></i>
          <span class="text-inverse">bell-slash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-bookmark"></i>
          <span class="text-inverse">bookmark</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-building"></i>
          <span class="text-inverse">building</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar"></i>
          <span class="text-inverse">calendar</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar-alt"></i>
          <span class="text-inverse">calendar-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar-check"></i>
          <span class="text-inverse">calendar-check</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar-minus"></i>
          <span class="text-inverse">calendar-minus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar-plus"></i>
          <span class="text-inverse">calendar-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-calendar-times"></i>
          <span class="text-inverse">calendar-times</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-caret-square-down"></i>
          <span class="text-inverse">caret-square-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-caret-square-left"></i>
          <span class="text-inverse">caret-square-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-caret-square-right"></i>
          <span class="text-inverse">caret-square-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-caret-square-up"></i>
          <span class="text-inverse">caret-square-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-chart-bar"></i>
          <span class="text-inverse">chart-bar</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-check-circle"></i>
          <span class="text-inverse">check-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-check-square"></i>
          <span class="text-inverse">check-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-circle"></i>
          <span class="text-inverse">circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-clipboard"></i>
          <span class="text-inverse">clipboard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-clock"></i>
          <span class="text-inverse">clock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-clone"></i>
          <span class="text-inverse">clone</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-closed-captioning"></i>
          <span class="text-inverse">closed-captioning</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-comment"></i>
          <span class="text-inverse">comment</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-comment-alt"></i>
          <span class="text-inverse">comment-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-comments"></i>
          <span class="text-inverse">comments</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-compass"></i>
          <span class="text-inverse">compass</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-copy"></i>
          <span class="text-inverse">copy</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-copyright"></i>
          <span class="text-inverse">copyright</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-credit-card"></i>
          <span class="text-inverse">credit-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-dot-circle"></i>
          <span class="text-inverse">dot-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-edit"></i>
          <span class="text-inverse">edit</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-envelope"></i>
          <span class="text-inverse">envelope</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-envelope-open"></i>
          <span class="text-inverse">envelope-open</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-eye-slash"></i>
          <span class="text-inverse">eye-slash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file"></i>
          <span class="text-inverse">file</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-alt"></i>
          <span class="text-inverse">file-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-archive"></i>
          <span class="text-inverse">file-archive</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-audio"></i>
          <span class="text-inverse">file-audio</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-code"></i>
          <span class="text-inverse">file-code</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-excel"></i>
          <span class="text-inverse">file-excel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-image"></i>
          <span class="text-inverse">file-image</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-pdf"></i>
          <span class="text-inverse">file-pdf</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-powerpoint"></i>
          <span class="text-inverse">file-powerpoint</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-video"></i>
          <span class="text-inverse">file-video</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-file-word"></i>
          <span class="text-inverse">file-word</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-flag"></i>
          <span class="text-inverse">flag</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-folder"></i>
          <span class="text-inverse">folder</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-folder-open"></i>
          <span class="text-inverse">folder-open</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-frown"></i>
          <span class="text-inverse">frown</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-futbol"></i>
          <span class="text-inverse">futbol</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="far fa-fw fa-gem"></i> <span class="text-inverse">gem</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-lizard"></i>
          <span class="text-inverse">hand-lizard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-paper"></i>
          <span class="text-inverse">hand-paper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-peace"></i>
          <span class="text-inverse">hand-peace</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-point-down"></i>
          <span class="text-inverse">hand-point-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-point-left"></i>
          <span class="text-inverse">hand-point-left</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-point-right"></i>
          <span class="text-inverse">hand-point-right</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-point-up"></i>
          <span class="text-inverse">hand-point-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-pointer"></i>
          <span class="text-inverse">hand-pointer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-rock"></i>
          <span class="text-inverse">hand-rock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-scissors"></i>
          <span class="text-inverse">hand-scissors</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hand-spock"></i>
          <span class="text-inverse">hand-spock</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-handshake"></i>
          <span class="text-inverse">handshake</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="far fa-fw fa-hdd"></i> <span class="text-inverse">hdd</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-heart"></i>
          <span class="text-inverse">heart</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hospital"></i>
          <span class="text-inverse">hospital</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-hourglass"></i>
          <span class="text-inverse">hourglass</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-id-badge"></i>
          <span class="text-inverse">id-badge</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-id-card"></i>
          <span class="text-inverse">id-card</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-image"></i>
          <span class="text-inverse">image</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-images"></i>
          <span class="text-inverse">images</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-keyboard"></i>
          <span class="text-inverse">keyboard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-lemon"></i>
          <span class="text-inverse">lemon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-life-ring"></i>
          <span class="text-inverse">life-ring</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-lightbulb"></i>
          <span class="text-inverse">lightbulb</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-list-alt"></i>
          <span class="text-inverse">list-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="far fa-fw fa-map"></i> <span class="text-inverse">map</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="far fa-fw fa-meh"></i> <span class="text-inverse">meh</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-minus-square"></i>
          <span class="text-inverse">minus-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-money-bill-alt"></i>
          <span class="text-inverse">money-bill-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-moon"></i>
          <span class="text-inverse">moon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-newspaper"></i>
          <span class="text-inverse">newspaper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-object-group"></i>
          <span class="text-inverse">object-group</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-object-ungroup"></i>
          <span class="text-inverse">object-ungroup</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-paper-plane"></i>
          <span class="text-inverse">paper-plane</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-pause-circle"></i>
          <span class="text-inverse">pause-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-play-circle"></i>
          <span class="text-inverse">play-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-plus-square"></i>
          <span class="text-inverse">plus-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-question-circle"></i>
          <span class="text-inverse">question-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-registered"></i>
          <span class="text-inverse">registered</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-save"></i>
          <span class="text-inverse">save</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-share-square"></i>
          <span class="text-inverse">share-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-smile"></i>
          <span class="text-inverse">smile</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-snowflake"></i>
          <span class="text-inverse">snowflake</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-square"></i>
          <span class="text-inverse">square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-star"></i>
          <span class="text-inverse">star</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-star-half"></i>
          <span class="text-inverse">star-half</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-sticky-note"></i>
          <span class="text-inverse">sticky-note</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-stop-circle"></i>
          <span class="text-inverse">stop-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="far fa-fw fa-sun"></i> <span class="text-inverse">sun</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-thumbs-down"></i>
          <span class="text-inverse">thumbs-down</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-thumbs-up"></i>
          <span class="text-inverse">thumbs-up</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-times-circle"></i>
          <span class="text-inverse">times-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-trash-alt"></i>
          <span class="text-inverse">trash-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-user"></i>
          <span class="text-inverse">user</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-user-circle"></i>
          <span class="text-inverse">user-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-window-close"></i>
          <span class="text-inverse">window-close</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-window-maximize"></i>
          <span class="text-inverse">window-maximize</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-window-minimize"></i>
          <span class="text-inverse">window-minimize</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="far fa-fw fa-window-restore"></i>
          <span class="text-inverse">window-restore</span>
        </div>
      </div>

      <div class="col-md-4 form-inline">
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-500px"></i>
          <span class="text-inverse">500px</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-accessible-icon"></i>
          <span class="text-inverse">accessible-icon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-accusoft"></i>
          <span class="text-inverse">accusoft</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-adn"></i> <span class="text-inverse">adn</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-adversal"></i>
          <span class="text-inverse">adversal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-affiliatetheme"></i>
          <span class="text-inverse">affiliatetheme</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-algolia"></i>
          <span class="text-inverse">algolia</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-amazon"></i>
          <span class="text-inverse">amazon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-amazon-pay"></i>
          <span class="text-inverse">amazon-pay</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-amilia"></i>
          <span class="text-inverse">amilia</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-android"></i>
          <span class="text-inverse">android</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-angellist"></i>
          <span class="text-inverse">angellist</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-angrycreative"></i>
          <span class="text-inverse">angrycreative</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-angular"></i>
          <span class="text-inverse">angular</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-app-store"></i>
          <span class="text-inverse">app-store</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-app-store-ios"></i>
          <span class="text-inverse">app-store-ios</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-apper"></i>
          <span class="text-inverse">apper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-apple"></i>
          <span class="text-inverse">apple</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-apple-pay"></i>
          <span class="text-inverse">apple-pay</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-asymmetrik"></i>
          <span class="text-inverse">asymmetrik</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-audible"></i>
          <span class="text-inverse">audible</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-autoprefixer"></i>
          <span class="text-inverse">autoprefixer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-avianex"></i>
          <span class="text-inverse">avianex</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-aviato"></i>
          <span class="text-inverse">aviato</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-aws"></i> <span class="text-inverse">aws</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bandcamp"></i>
          <span class="text-inverse">bandcamp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-behance"></i>
          <span class="text-inverse">behance</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-behance-square"></i>
          <span class="text-inverse">behance-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bimobject"></i>
          <span class="text-inverse">bimobject</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bitbucket"></i>
          <span class="text-inverse">bitbucket</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bitcoin"></i>
          <span class="text-inverse">bitcoin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bity"></i>
          <span class="text-inverse">bity</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-black-tie"></i>
          <span class="text-inverse">black-tie</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-blackberry"></i>
          <span class="text-inverse">blackberry</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-blogger"></i>
          <span class="text-inverse">blogger</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-blogger-b"></i>
          <span class="text-inverse">blogger-b</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bluetooth"></i>
          <span class="text-inverse">bluetooth</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-bluetooth-b"></i>
          <span class="text-inverse">bluetooth-b</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-btc"></i> <span class="text-inverse">btc</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-buromobelexperte"></i>
          <span class="text-inverse">buromobelexperte</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-buysellads"></i>
          <span class="text-inverse">buysellads</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-amazon-pay"></i>
          <span class="text-inverse">cc-amazon-pay</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-amex"></i>
          <span class="text-inverse">cc-amex</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-apple-pay"></i>
          <span class="text-inverse">cc-apple-pay</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-diners-club"></i>
          <span class="text-inverse">cc-diners-club</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-discover"></i>
          <span class="text-inverse">cc-discover</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-jcb"></i>
          <span class="text-inverse">cc-jcb</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-mastercard"></i>
          <span class="text-inverse">cc-mastercard</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-paypal"></i>
          <span class="text-inverse">cc-paypal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-stripe"></i>
          <span class="text-inverse">cc-stripe</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cc-visa"></i>
          <span class="text-inverse">cc-visa</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-centercode"></i>
          <span class="text-inverse">centercode</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-chrome"></i>
          <span class="text-inverse">chrome</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cloudscale"></i>
          <span class="text-inverse">cloudscale</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cloudsmith"></i>
          <span class="text-inverse">cloudsmith</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cloudversify"></i>
          <span class="text-inverse">cloudversify</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-codepen"></i>
          <span class="text-inverse">codepen</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-codiepie"></i>
          <span class="text-inverse">codiepie</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-connectdevelop"></i>
          <span class="text-inverse">connectdevelop</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-contao"></i>
          <span class="text-inverse">contao</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cpanel"></i>
          <span class="text-inverse">cpanel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-creative-commons"></i>
          <span class="text-inverse">creative-commons</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-css3"></i>
          <span class="text-inverse">css3</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-css3-alt"></i>
          <span class="text-inverse">css3-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-cuttlefish"></i>
          <span class="text-inverse">cuttlefish</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-d-and-d"></i>
          <span class="text-inverse">d-and-d</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dashcube"></i>
          <span class="text-inverse">dashcube</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-delicious"></i>
          <span class="text-inverse">delicious</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-deploydog"></i>
          <span class="text-inverse">deploydog</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-deskpro"></i>
          <span class="text-inverse">deskpro</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-deviantart"></i>
          <span class="text-inverse">deviantart</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-digg"></i>
          <span class="text-inverse">digg</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-digital-ocean"></i>
          <span class="text-inverse">digital-ocean</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-discord"></i>
          <span class="text-inverse">discord</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-discourse"></i>
          <span class="text-inverse">discourse</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dochub"></i>
          <span class="text-inverse">dochub</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-docker"></i>
          <span class="text-inverse">docker</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-draft2digital"></i>
          <span class="text-inverse">draft2digital</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dribbble"></i>
          <span class="text-inverse">dribbble</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dribbble-square"></i>
          <span class="text-inverse">dribbble-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dropbox"></i>
          <span class="text-inverse">dropbox</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-drupal"></i>
          <span class="text-inverse">drupal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-dyalog"></i>
          <span class="text-inverse">dyalog</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-earlybirds"></i>
          <span class="text-inverse">earlybirds</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-edge"></i>
          <span class="text-inverse">edge</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-elementor"></i>
          <span class="text-inverse">elementor</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-ember"></i>
          <span class="text-inverse">ember</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-empire"></i>
          <span class="text-inverse">empire</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-envira"></i>
          <span class="text-inverse">envira</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-erlang"></i>
          <span class="text-inverse">erlang</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-ethereum"></i>
          <span class="text-inverse">ethereum</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-etsy"></i>
          <span class="text-inverse">etsy</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-expeditedssl"></i>
          <span class="text-inverse">expeditedssl</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-facebook"></i>
          <span class="text-inverse">facebook</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-facebook-f"></i>
          <span class="text-inverse">facebook-f</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-facebook-messenger"></i>
          <span class="text-inverse">facebook-messenger</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-facebook-square"></i>
          <span class="text-inverse">facebook-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-firefox"></i>
          <span class="text-inverse">firefox</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-first-order"></i>
          <span class="text-inverse">first-order</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-firstdraft"></i>
          <span class="text-inverse">firstdraft</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-flickr"></i>
          <span class="text-inverse">flickr</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-fly"></i> <span class="text-inverse">fly</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-font-awesome"></i>
          <span class="text-inverse">font-awesome</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-font-awesome-alt"></i>
          <span class="text-inverse">font-awesome-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-font-awesome-flag"></i>
          <span class="text-inverse">font-awesome-flag</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-fonticons"></i>
          <span class="text-inverse">fonticons</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-fonticons-fi"></i>
          <span class="text-inverse">fonticons-fi</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-fort-awesome"></i>
          <span class="text-inverse">fort-awesome</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-fort-awesome-alt"></i>
          <span class="text-inverse">fort-awesome-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-forumbee"></i>
          <span class="text-inverse">forumbee</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-foursquare"></i>
          <span class="text-inverse">foursquare</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-free-code-camp"></i>
          <span class="text-inverse">free-code-camp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-freebsd"></i>
          <span class="text-inverse">freebsd</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-get-pocket"></i>
          <span class="text-inverse">get-pocket</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-gg"></i> <span class="text-inverse">gg</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gg-circle"></i>
          <span class="text-inverse">gg-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-git"></i> <span class="text-inverse">git</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-git-square"></i>
          <span class="text-inverse">git-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-github"></i>
          <span class="text-inverse">github</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-github-alt"></i>
          <span class="text-inverse">github-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-github-square"></i>
          <span class="text-inverse">github-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gitkraken"></i>
          <span class="text-inverse">gitkraken</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gitlab"></i>
          <span class="text-inverse">gitlab</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gitter"></i>
          <span class="text-inverse">gitter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-glide"></i>
          <span class="text-inverse">glide</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-glide-g"></i>
          <span class="text-inverse">glide-g</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gofore"></i>
          <span class="text-inverse">gofore</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-goodreads"></i>
          <span class="text-inverse">goodreads</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-goodreads-g"></i>
          <span class="text-inverse">goodreads-g</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google"></i>
          <span class="text-inverse">google</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-drive"></i>
          <span class="text-inverse">google-drive</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-play"></i>
          <span class="text-inverse">google-play</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-plus"></i>
          <span class="text-inverse">google-plus</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-plus-g"></i>
          <span class="text-inverse">google-plus-g</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-plus-square"></i>
          <span class="text-inverse">google-plus-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-google-wallet"></i>
          <span class="text-inverse">google-wallet</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gratipay"></i>
          <span class="text-inverse">gratipay</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-grav"></i>
          <span class="text-inverse">grav</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gripfire"></i>
          <span class="text-inverse">gripfire</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-grunt"></i>
          <span class="text-inverse">grunt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-gulp"></i>
          <span class="text-inverse">gulp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hacker-news"></i>
          <span class="text-inverse">hacker-news</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hacker-news-square"></i>
          <span class="text-inverse">hacker-news-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hire-a-helper"></i>
          <span class="text-inverse">hire-a-helper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hooli"></i>
          <span class="text-inverse">hooli</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hotjar"></i>
          <span class="text-inverse">hotjar</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-houzz"></i>
          <span class="text-inverse">houzz</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-html5"></i>
          <span class="text-inverse">html5</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-hubspot"></i>
          <span class="text-inverse">hubspot</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-imdb"></i>
          <span class="text-inverse">imdb</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-instagram"></i>
          <span class="text-inverse">instagram</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-internet-explorer"></i>
          <span class="text-inverse">internet-explorer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-ioxhost"></i>
          <span class="text-inverse">ioxhost</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-itunes"></i>
          <span class="text-inverse">itunes</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-itunes-note"></i>
          <span class="text-inverse">itunes-note</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-jenkins"></i>
          <span class="text-inverse">jenkins</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-joget"></i>
          <span class="text-inverse">joget</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-joomla"></i>
          <span class="text-inverse">joomla</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-js"></i> <span class="text-inverse">js</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-js-square"></i>
          <span class="text-inverse">js-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-jsfiddle"></i>
          <span class="text-inverse">jsfiddle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-keycdn"></i>
          <span class="text-inverse">keycdn</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-kickstarter"></i>
          <span class="text-inverse">kickstarter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-kickstarter-k"></i>
          <span class="text-inverse">kickstarter-k</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-korvue"></i>
          <span class="text-inverse">korvue</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-laravel"></i>
          <span class="text-inverse">laravel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-lastfm"></i>
          <span class="text-inverse">lastfm</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-lastfm-square"></i>
          <span class="text-inverse">lastfm-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-leanpub"></i>
          <span class="text-inverse">leanpub</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-less"></i>
          <span class="text-inverse">less</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-line"></i>
          <span class="text-inverse">line</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-linkedin"></i>
          <span class="text-inverse">linkedin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-linkedin-in"></i>
          <span class="text-inverse">linkedin-in</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-linode"></i>
          <span class="text-inverse">linode</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-linux"></i>
          <span class="text-inverse">linux</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-lyft"></i>
          <span class="text-inverse">lyft</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-magento"></i>
          <span class="text-inverse">magento</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-maxcdn"></i>
          <span class="text-inverse">maxcdn</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-medapps"></i>
          <span class="text-inverse">medapps</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-medium"></i>
          <span class="text-inverse">medium</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-medium-m"></i>
          <span class="text-inverse">medium-m</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-medrt"></i>
          <span class="text-inverse">medrt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-meetup"></i>
          <span class="text-inverse">meetup</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-microsoft"></i>
          <span class="text-inverse">microsoft</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-mix"></i> <span class="text-inverse">mix</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-mixcloud"></i>
          <span class="text-inverse">mixcloud</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-mizuni"></i>
          <span class="text-inverse">mizuni</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-modx"></i>
          <span class="text-inverse">modx</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-monero"></i>
          <span class="text-inverse">monero</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-napster"></i>
          <span class="text-inverse">napster</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-nintendo-switch"></i>
          <span class="text-inverse">nintendo-switch</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-node"></i>
          <span class="text-inverse">node</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-node-js"></i>
          <span class="text-inverse">node-js</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-npm"></i> <span class="text-inverse">npm</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-ns8"></i> <span class="text-inverse">ns8</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-nutritionix"></i>
          <span class="text-inverse">nutritionix</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-odnoklassniki"></i>
          <span class="text-inverse">odnoklassniki</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-odnoklassniki-square"></i>
          <span class="text-inverse">odnoklassniki-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-opencart"></i>
          <span class="text-inverse">opencart</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-openid"></i>
          <span class="text-inverse">openid</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-opera"></i>
          <span class="text-inverse">opera</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-optin-monster"></i>
          <span class="text-inverse">optin-monster</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-osi"></i> <span class="text-inverse">osi</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-page4"></i>
          <span class="text-inverse">page4</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pagelines"></i>
          <span class="text-inverse">pagelines</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-palfed"></i>
          <span class="text-inverse">palfed</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-patreon"></i>
          <span class="text-inverse">patreon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-paypal"></i>
          <span class="text-inverse">paypal</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-periscope"></i>
          <span class="text-inverse">periscope</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-phabricator"></i>
          <span class="text-inverse">phabricator</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-phoenix-framework"></i>
          <span class="text-inverse">phoenix-framework</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pied-piper"></i>
          <span class="text-inverse">pied-piper</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pied-piper-alt"></i>
          <span class="text-inverse">pied-piper-alt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pied-piper-pp"></i>
          <span class="text-inverse">pied-piper-pp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pinterest"></i>
          <span class="text-inverse">pinterest</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pinterest-p"></i>
          <span class="text-inverse">pinterest-p</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pinterest-square"></i>
          <span class="text-inverse">pinterest-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-playstation"></i>
          <span class="text-inverse">playstation</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-product-hunt"></i>
          <span class="text-inverse">product-hunt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-pushed"></i>
          <span class="text-inverse">pushed</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-python"></i>
          <span class="text-inverse">python</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-qq"></i> <span class="text-inverse">qq</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-quora"></i>
          <span class="text-inverse">quora</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-ravelry"></i>
          <span class="text-inverse">ravelry</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-react"></i>
          <span class="text-inverse">react</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-rebel"></i>
          <span class="text-inverse">rebel</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-red-river"></i>
          <span class="text-inverse">red-river</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-reddit"></i>
          <span class="text-inverse">reddit</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-reddit-alien"></i>
          <span class="text-inverse">reddit-alien</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-reddit-square"></i>
          <span class="text-inverse">reddit-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-rendact"></i>
          <span class="text-inverse">rendact</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-renren"></i>
          <span class="text-inverse">renren</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-replyd"></i>
          <span class="text-inverse">replyd</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-resolving"></i>
          <span class="text-inverse">resolving</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-rocketchat"></i>
          <span class="text-inverse">rocketchat</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-rockrms"></i>
          <span class="text-inverse">rockrms</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-safari"></i>
          <span class="text-inverse">safari</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-sass"></i>
          <span class="text-inverse">sass</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-schlix"></i>
          <span class="text-inverse">schlix</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-scribd"></i>
          <span class="text-inverse">scribd</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-searchengin"></i>
          <span class="text-inverse">searchengin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-sellcast"></i>
          <span class="text-inverse">sellcast</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-sellsy"></i>
          <span class="text-inverse">sellsy</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-servicestack"></i>
          <span class="text-inverse">servicestack</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-shirtsinbulk"></i>
          <span class="text-inverse">shirtsinbulk</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-simplybuilt"></i>
          <span class="text-inverse">simplybuilt</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-sistrix"></i>
          <span class="text-inverse">sistrix</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-skyatlas"></i>
          <span class="text-inverse">skyatlas</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-skype"></i>
          <span class="text-inverse">skype</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-slack"></i>
          <span class="text-inverse">slack</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-slack-hash"></i>
          <span class="text-inverse">slack-hash</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-slideshare"></i>
          <span class="text-inverse">slideshare</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-snapchat"></i>
          <span class="text-inverse">snapchat</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-snapchat-ghost"></i>
          <span class="text-inverse">snapchat-ghost</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-snapchat-square"></i>
          <span class="text-inverse">snapchat-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-soundcloud"></i>
          <span class="text-inverse">soundcloud</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-speakap"></i>
          <span class="text-inverse">speakap</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-spotify"></i>
          <span class="text-inverse">spotify</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stack-exchange"></i>
          <span class="text-inverse">stack-exchange</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stack-overflow"></i>
          <span class="text-inverse">stack-overflow</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-staylinked"></i>
          <span class="text-inverse">staylinked</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-steam"></i>
          <span class="text-inverse">steam</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-steam-square"></i>
          <span class="text-inverse">steam-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-steam-symbol"></i>
          <span class="text-inverse">steam-symbol</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-sticker-mule"></i>
          <span class="text-inverse">sticker-mule</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-strava"></i>
          <span class="text-inverse">strava</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stripe"></i>
          <span class="text-inverse">stripe</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stripe-s"></i>
          <span class="text-inverse">stripe-s</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-studiovinari"></i>
          <span class="text-inverse">studiovinari</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stumbleupon"></i>
          <span class="text-inverse">stumbleupon</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-stumbleupon-circle"></i>
          <span class="text-inverse">stumbleupon-circle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-superpowers"></i>
          <span class="text-inverse">superpowers</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-supple"></i>
          <span class="text-inverse">supple</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-telegram"></i>
          <span class="text-inverse">telegram</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-telegram-plane"></i>
          <span class="text-inverse">telegram-plane</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-tencent-weibo"></i>
          <span class="text-inverse">tencent-weibo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-themeisle"></i>
          <span class="text-inverse">themeisle</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-trello"></i>
          <span class="text-inverse">trello</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-tripadvisor"></i>
          <span class="text-inverse">tripadvisor</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-tumblr"></i>
          <span class="text-inverse">tumblr</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-tumblr-square"></i>
          <span class="text-inverse">tumblr-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-twitch"></i>
          <span class="text-inverse">twitch</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-twitter"></i>
          <span class="text-inverse">twitter</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-twitter-square"></i>
          <span class="text-inverse">twitter-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-typo3"></i>
          <span class="text-inverse">typo3</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-uber"></i>
          <span class="text-inverse">uber</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-uikit"></i>
          <span class="text-inverse">uikit</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-uniregistry"></i>
          <span class="text-inverse">uniregistry</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-untappd"></i>
          <span class="text-inverse">untappd</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-usb"></i> <span class="text-inverse">usb</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-ussunnah"></i>
          <span class="text-inverse">ussunnah</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vaadin"></i>
          <span class="text-inverse">vaadin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-viacoin"></i>
          <span class="text-inverse">viacoin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-viadeo"></i>
          <span class="text-inverse">viadeo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-viadeo-square"></i>
          <span class="text-inverse">viadeo-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-viber"></i>
          <span class="text-inverse">viber</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vimeo"></i>
          <span class="text-inverse">vimeo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vimeo-square"></i>
          <span class="text-inverse">vimeo-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vimeo-v"></i>
          <span class="text-inverse">vimeo-v</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vine"></i>
          <span class="text-inverse">vine</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-vk"></i> <span class="text-inverse">vk</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis"><i class="fab fa-fw fa-vnv"></i> <span class="text-inverse">vnv</span></div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-vuejs"></i>
          <span class="text-inverse">vuejs</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-weibo"></i>
          <span class="text-inverse">weibo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-weixin"></i>
          <span class="text-inverse">weixin</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-whatsapp"></i>
          <span class="text-inverse">whatsapp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-whatsapp-square"></i>
          <span class="text-inverse">whatsapp-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-whmcs"></i>
          <span class="text-inverse">whmcs</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wikipedia-w"></i>
          <span class="text-inverse">wikipedia-w</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-windows"></i>
          <span class="text-inverse">windows</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wordpress"></i>
          <span class="text-inverse">wordpress</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wordpress-simple"></i>
          <span class="text-inverse">wordpress-simple</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wpbeginner"></i>
          <span class="text-inverse">wpbeginner</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wpexplorer"></i>
          <span class="text-inverse">wpexplorer</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-wpforms"></i>
          <span class="text-inverse">wpforms</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-xbox"></i>
          <span class="text-inverse">xbox</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-xing"></i>
          <span class="text-inverse">xing</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-xing-square"></i>
          <span class="text-inverse">xing-square</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-y-combinator"></i>
          <span class="text-inverse">y-combinator</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-yahoo"></i>
          <span class="text-inverse">yahoo</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-yandex"></i>
          <span class="text-inverse">yandex</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-yandex-international"></i>
          <span class="text-inverse">yandex-international</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-yelp"></i>
          <span class="text-inverse">yelp</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-yoast"></i>
          <span class="text-inverse">yoast</span>
        </div>
        <div class="m-b-10 m-r-10 text-ellipsis">
          <i class="fab fa-fw fa-youtube"></i>
          <span class="text-inverse">youtube</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const iconClass = ref(null);
const props = defineProps(['iconValue']);
const emit = defineEmits(['update']);
console.log('props: ', props.iconValue);
const iconClick = event => {
  const clickedElement = event.target; // Get the clicked element
  // console.log('aa : ', clickedElement);

  if (clickedElement.tagName.toLowerCase() === 'i') {
    // || clickedElement.classList.contains('your-icon-class')) {
    iconClass.value = clickedElement.className;
    // console.log('icon class : ', iconClass.value);
    // console.log('icon props : ', props.iconValue);
    emit('update', iconClass.value);
    // console.log('icon class : ', iconClass);
    // let ref = $('#menuTree').jstree(true);
    // let sel = ref.get_selected();
    // this.old_icon = ref.get_icon(sel);
    // if (!sel.length) {
    //   return false;
    // }
    // ref.set_icon(sel, iconClass);
  }
};
</script>
