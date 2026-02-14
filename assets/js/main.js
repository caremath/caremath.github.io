/*
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// Sidebar.
		var $sidebar = $('#sidebar'),
			$sidebar_inner = $sidebar.children('.inner');

		// Inactive by default on <= large.
			breakpoints.on('<=large', function() {
				$sidebar.addClass('inactive');
			});

			breakpoints.on('>large', function() {
				$sidebar.removeClass('inactive');
			});

		// Hack: Workaround for Chrome/Android scrollbar position bug.
			if (browser.os == 'android'
			&&	browser.name == 'chrome')
				$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
					.appendTo($head);

		// Toggle.
			$('<a href="#sidebar" class="toggle">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Toggle.
						$sidebar.toggleClass('inactive');

				});

		// Events.

			// Link clicks.
				$sidebar.on('click', 'a', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Vars.
						var $a = $(this),
							href = $a.attr('href'),
							target = $a.attr('target');

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Check URL.
						if (!href || href == '#' || href == '')
							return;

					// Hide sidebar.
						$sidebar.addClass('inactive');

					// Redirect to href.
						setTimeout(function() {

							if (target == '_blank')
								window.open(href);
							else
								window.location.href = href;

						}, 500);

				});

			// Prevent certain events inside the panel from bubbling.
				$sidebar.on('click touchend touchstart touchmove', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Prevent propagation.
						event.stopPropagation();

				});

			// Hide panel on body click/tap.
				$body.on('click touchend', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Deactivate.
						$sidebar.addClass('inactive');

				});

		// Scroll lock.
		// Note: If you do anything to change the height of the sidebar's content, be sure to
		// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

			$window.on('load.sidebar-lock', function() {

				var sh, wh, st;

				// Reset scroll position to 0 if it's 1.
					if ($window.scrollTop() == 1)
						$window.scrollTop(0);

				$window
					.on('scroll.sidebar-lock', function() {

						var x, y;

						// <=large? Bail.
							if (breakpoints.active('<=large')) {

								$sidebar_inner
									.data('locked', 0)
									.css('position', '')
									.css('top', '');

								return;

							}

						// Calculate positions.
							x = Math.max(sh - wh, 0);
							y = Math.max(0, $window.scrollTop() - x);

						// Lock/unlock.
							if ($sidebar_inner.data('locked') == 1) {

								if (y <= 0)
									$sidebar_inner
										.data('locked', 0)
										.css('position', '')
										.css('top', '');
								else
									$sidebar_inner
										.css('top', -1 * x);

							}
							else {

								if (y > 0)
									$sidebar_inner
										.data('locked', 1)
										.css('position', 'fixed')
										.css('top', -1 * x);

							}

					})
					.on('resize.sidebar-lock', function() {

						// Calculate heights.
							wh = $window.height();
							sh = $sidebar_inner.outerHeight() + 30;

						// Trigger scroll.
							$window.trigger('scroll.sidebar-lock');

					})
					.trigger('resize.sidebar-lock');

				});

	// Menu.
		var $menu = $('#menu'),
			$menu_openers = $menu.children('ul').find('.opener');

		// Openers.
			$menu_openers.each(function() {

				var $this = $(this);

				$this.on('click', function(event) {

					// Prevent default.
						event.preventDefault();

					// Toggle.
						$menu_openers.not($this).removeClass('active');
						$this.toggleClass('active');

					// Trigger resize (sidebar lock).
						$window.triggerHandler('resize.sidebar-lock');

				});

			});

})(jQuery);

// Personal

document.querySelectorAll('details').forEach((el) => {
  const summary = el.querySelector('summary');
  const content = el.querySelector('.content');

  summary.addEventListener('click', (e) => {
    e.preventDefault(); // Stop the browser from opening it instantly
    
	if (el.open) {
    el.classList.remove('is-open');
    // Ensure this 500ms matches the 0.5s in your CSS
    setTimeout(() => { 
        el.open = false; 
    }, 500); 
	} else {
      // OPENING: Set 'open' attribute, then start animation
      el.open = true;
      // Small delay so the browser registers the change before animating
      window.requestAnimationFrame(() => {
        el.classList.add('is-open');
      });
    }
  });
});

// Data Cloud ++

const bubbles = document.querySelectorAll('.bubble');

// Each bubble gets a unique "dna" object for its own speed and path
const bubbleData = Array.from(bubbles).map((_,i) => ({
    xAngle: (i * (Math.PI * 2 / 9)),
    yAngle: Math.random() * Math.PI * 2,
    zAngle: (i * (Math.PI * 2 / 9)),
    // Random speeds for that "slow/fast" organic feel
    xSpeed: 0.002 + Math.random() * 0.003,
    ySpeed: 0.003 + Math.random() * 0.004,
    zSpeed: 0.01
}));

function animate() {
    bubbles.forEach((el, i) => {
        const data = bubbleData[i];

        // Increment angles
        data.xAngle += (data.xSpeed)*(0.7);
        data.yAngle += (data.ySpeed)*(0.7);
        data.zAngle += (data.zSpeed);

        // Calculate positions (-1 to 1 range)
        // We use different math for X, Y, and Z to avoid circular paths
        const xSide = Math.cos(data.xAngle) * 25; // Horizontal drift %
        const ySide = Math.sin(data.yAngle) * 25; // Vertical drift %
        const zDepth = Math.sin(data.zAngle);      // Depth -1 (far) to 1 (near)

        // Map Z-Depth to visual styles
        const scale = (zDepth + 2) / 2;       // Range: 0.5 to 1.5
        const opacity = (zDepth + 2) / 3;     // Range: 0.3 to 1.0
        const blur = (1 - zDepth) * (1);        // Range: 0px to 4px (Blur when far)

        // Apply styles
        // We use % for positioning so it stays responsive on your Ubuntu screen
        el.style.left = `${35 + xSide}%`;
        el.style.top = `${50 + ySide}%`;
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = opacity;
        el.style.filter = `blur(${blur}px)`;
        el.style.zIndex = Math.round(zDepth * 100);
    });

    requestAnimationFrame(animate);
}

animate();