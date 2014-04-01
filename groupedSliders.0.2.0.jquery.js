// Version 0.2.3
(function($)
{
	$.fn.groupedSliders = function(options)
	{
        var $sliderGroup; // the container to look for sliders
        var $sliders; // the actual sliders found
        
	    var sliderTotal;
        var lockedTotal;

		var defaults = 
		{
			startState: 'unlocked',
			total: 100
		}

		var settings = $.extend({},defaults,options);

        // Should return something from activateSliders for jquery chaining
        return this.each(activateSliders) // End plugin logic container
        
             
        function activateSliders()
        { // Plugin logic container
			$sliderGroup = $(this);
            $sliders = $sliderGroup.find(".slider");
            
			$sliders.addClass(settings.startState);

			// Activate sliders
			$sliders.slider({ 
				range:'min',
				min: 0,
				max: settings.total, 
				value: Math.floor(settings.total / $sliders.length), 
				animate:'fast',
			});
            
            bindUI();
            
			bindSliders(); 

			balanceSliders();
		} // end activateSliders
        
        
		function bindUI()
		{
			$sliderGroup.on('change', '.slider-text', sliderLabelChange);
			$sliderGroup.on('click', '.slider-lock', sliderLockClick);
			$sliderGroup.on('change', '.slider-lock', sliderLockChange);
		}	
		
        function bindSliders() 
		{
			$sliderGroup.on('slide slidechange', '.slider', sliderChange);
		}		
		
		function calculateSliderTotal()
		{
			sliderTotal = 0;
			$sliders.each(function()
			{
				var value = $(this).slider( "option", "value" );
				sliderTotal += value;		
			})
		}	

		function calculateLockedTotal()
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
		
		function balanceSliders()
		{
			calculateLockedTotal();
			calculateSliderTotal();

			var $tempSliders;

			$sliderGroup.off('slide slidechange', '.slider');
			
			$tempSliders = $sliders.filter('.unlocked').not('.clicked')

			var $clicked = $sliders.filter('.clicked')

			var clickedVal = $clicked.slider("option", "value");

			if ($tempSliders.length === 0)
			{
				$clicked.slider("value", settings.total - lockedTotal);
			} else if (clickedVal > settings.total - lockedTotal)
			{	// Skips balancing logic if changed slider will occupy all available space

				$tempSliders.slider("value", 0);

				$clicked.slider("value", settings.total - lockedTotal);
				sliderTotal = settings.total;
			}

			$clicked.removeClass('clicked');

			applyBalancingLogic($tempSliders);

			sliderLabelUpdate(); // Update slider labels to match new values	

			bindSliders();

		} // End balance sliders function

    
		function applyBalancingLogic($sliders)
		{
            var sliderCount = $sliders.length;

            while (sliderTotal != settings.total && $sliders.length !== 0) 
			{	
				var rand = Math.floor((Math.random()*$sliders.length));
				
				var $randSlider = $sliders.eq(rand)
				
				var value = $randSlider.slider( "option", "value" );
				
				var increment = Math.ceil(Math.abs(sliderTotal-settings.total)/sliderCount);

				//console.log('Value of Slider '+rand+' : ' + value)
				//console.log('Size of Increment: ' + increment)


				if (sliderTotal > settings.total)
				{
					if (Math.abs(increment) > value)
					{
						increment = value;	
						
						//console.log('Increment Too Big, new increment: ' + increment)

						$sliders.splice(rand,1);
						//console.log('Slider removed, new length: ' + $tempSliders.length)
					}

					increment *= -1;
					//console.log('Going Down: ' + increment)
				}

				if ((value + increment) >= 0 && (value + increment) <= settings.total )
				{
					//console.log('Final Increment is: ' + increment)
					//console.log('Final Value is: ' + value)

					value+=increment;

					sliderTotal+=increment;

					$randSlider.slider( "value", value ); // do this with substitue array of values rather than directly with sliders
					
					//console.log('New value:' + $randSlider.slider( "option", "value" ))
				} else {
					//console.log('hmm')
				}

			}
		}

		function toggleSlider(t)
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

		function disableInputs() 
		{	
			$sliders.slider("disable").prev('input').attr('readonly','readonly');
			$sliders.removeClass('unlocked');
			$sliders.addClass('locked');
			$sliders.next('.slider-lock').addClass('ui-icon-locked');
			$sliders.next('.slider-lock').removeClass('ui-icon-unlocked');

			calculateLockedTotal();
		}

		function enableInputs() 
		{

			$sliders.slider("enable").prev('input').removeAttr('readonly');
			$sliders.removeClass('locked');
			$sliders.addClass('unlocked');
			$sliders.next('.slider-lock').addClass('ui-icon-unlocked');
			$sliders.next('.slider-lock').removeClass('ui-icon-locked');

			calculateLockedTotal();
		}

        // Get value of slider to cooresponding text box
        function sliderLabelUpdate()		
        {
            $('.slider-text').val(function()
            {
                var val = $(this).next('.slider').slider( "option", "value");
                return val;             
            })
        }
		
        /**************************************** Event Handlers ****************************************/
        function sliderLabelChange(event)
        {
            event.preventDefault();
            
            
            var slider = $(this).next('.slider');
            var value = this.value;
            slider.slider("value", value);
            
            
            slider.trigger('slide'); // Slider balacing requires slide event, so trigger slide event
        }

        function sliderLockClick(event)
		{
			event.preventDefault();
			var t = $(this);
			toggleSlider(t);
		};	

		/* Updates Slider value on text box change, slider value change triggers slider balancing */
		function sliderLockChange()
		{
			var value = $(this).val();
			$(this).next('.slider').slider("value", value);
		};
		
        function sliderChange(event)
        {
            var t = $(this);
            t.addClass('clicked');	
            balanceSliders();
        }
        

	} // Ending grouped sliders 

})(jQuery);