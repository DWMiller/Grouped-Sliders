(function($)
{
	$.fn.groupedSliders = function(options)
	{
		var defaults = 
		{
			startState: 'unlocked',
			total: 100
		}

		var settings = $.extend({},defaults,options);


		return this.each(function() 
		{ // Plugin logic container
			var $sliderGroup = $(this);

			console.log($sliderGroup)

			var $sliders = $sliderGroup.find(".slider");
			$sliders.addClass(settings.startState);

			// Activate sliders
			$sliders.slider({ 
				range:'min',
				min: 0,
				max: settings.total, 
				value: Math.floor(settings.total / $sliders.length), 
				animate:'fast',
			});

			var bindUI = function()
			{
				$sliderGroup.on('change', '.slider-text', function(event)
				{
					event.preventDefault();
					var slider = $(this).next('.slider');
					var value = this.value;
					slider.slider("value", value);
					slider.trigger('slide') // Slider balacing requires slide event, so trigger slide event
				});

				$sliderGroup.on('click', '.slider-lock', function(event)
				{
					event.preventDefault();
					var t = $(this);
					toggleSlider(t)
				});	

				/* Updates Slider value on text box change, slider value change triggers slider balancing */
				$sliderGroup.on('change', '.slider-lock', function(event)
				{
					value = $(this).val();
					$(this).next('.slider').slider("value", value);
				});	
			}()

			var bindSliders = function() 
			{
				$sliderGroup.on('slide slidechange', '.slider', function(event) 
				{
					var t = $(this);
					t.addClass('clicked');	
					balanceSliders();
				});
			}
			bindSliders();

			var calculateSliderTotal=function()
			{
				sliderTotal = 0;
				$sliders.each(function()
				{
					var value = $(this).slider( "option", "value" );
					sliderTotal += value;		
				})
			}	

			var calculateLockedTotal=function()
			{
				// Sums value of locked sliders and non-adjustable scale components
				// 
				lockedTotal = 0;
					
				$sliders.filter('.locked').each(function()
				{
					var value = $(this).slider( "option", "value" );
					lockedTotal += value;			
				})	
			}

			var balanceSliders = function()
			{
				calculateLockedTotal();
				calculateSliderTotal();

				var $tempSliders;

				$sliderGroup.off('slide slidechange', '.slider');
				
				//var sliders = []; // CReate array of sliders so random selection is possible
				
	
				$tempSliders = $sliders.filter('.unlocked').not('.clicked')

				var $clicked = $sliders.filter('.clicked')

				var clickedVal = $clicked.slider("option", "value");

				if ($tempSliders.length == 0)
				{
					$clicked.slider("value", settings.total - lockedTotal);
				} else if (clickedVal > settings.total - lockedTotal)
				{	// Skips balancing logic if changed slider will occupy all available space

					$tempSliders.slider("value", 0);

					$clicked.slider("value", settings.total - lockedTotal);
					sliderTotal = settings.total;
				}

				$clicked.removeClass('clicked');

				while (sliderTotal != settings.total && $tempSliders.length != 0) 
				{	
					var rand = Math.floor((Math.random()*$tempSliders.length));
					
					var $randSlider = $tempSliders.eq(rand)
					
					var value = $randSlider.slider( "option", "value" );
					
					var increment = Math.ceil(Math.abs(sliderTotal-settings.total)/$tempSliders.length);

					if (sliderTotal > settings.total)
					{
						increment *= -1;
					}

				
					if (Math.abs(increment) > value && increment < 0)
					{
						increment = value;
					}

					if ((value + increment) >= 0 && (value + increment) <= settings.total )
					{
						value+=increment;
						sliderTotal+=increment;
						$randSlider.slider( "value", value );
					}
				}
				
				$('.slider-lock').val(function(){
					var t = $(this);
					var comp = t.attr('name')
					var val = t.next('.slider').slider( "option", "value");
					return val;
				})	

				bindSliders();

			} // End balance sliders function

			var toggleSlider = function(t)
			{	// Clicking toggles slider bar between locked and unlocked state

				t.toggleClass('ui-icon-unlocked ui-icon-locked');
				
				var thisSlider = t.prev('.slider');

				thisSlider.toggleClass('unlocked locked');
				
				if(thisSlider.hasClass('unlocked'))
				{
					thisSlider.slider("enable");
					$(thisSlider).prev('input').removeAttr('readonly');
				} else {
					thisSlider.slider( "disable" );
				}

				// If locked elements are using settings.total%, changes are impossible. Disable everything.
				calculateLockedTotal();

				if (lockedTotal >= settings.total)
				{
					disableInputs();
				}
			}

			var disableInputs = function() 
			{	
				$('.slider').slider("disable").prev('input').attr('readonly','readonly');
				$('.slider').removeClass('unlocked');
				$('.slider').addClass('locked');
				$('.slider').next('span.ui-icon').addClass('ui-icon-locked');
				$('.slider').next('span.ui-icon').removeClass('ui-icon-unlocked');

				calculateLockedTotal();
			}

			var enableInputs = function() 
			{
				var slider = ('.slider')
				$.slider("enable").prev('input').removeAttr('readonly');
				$.removeClass('locked');
				$.addClass('unlocked');
				$.next('span.ui-icon').addClass('ui-icon-unlocked');
				$.next('span.ui-icon').removeClass('ui-icon-locked');

				calculateLockedTotal();
			}



		}) // End plugin logic container

	} // Ending grouped sliders 

})(jQuery);