<script src="groupedSliders.0.2.0.jquery.js"></script>

# Grouped Sliders

### A jquery plugin to implement grouped behavior to jQuery UI sliders.
View the [Demo](http://jsfiddle.net/DWMiller/UZqwr/embedded/result/)

## Instructions

### Dependencies:
<ol>
    <li>jQuery</li>
    <li>jQueryUI - Slider Component</li>
</ol>

### Basic usage:
<em>Note: This plugin will activate sliders using jQuery UI. To function properly, sliders much not be previously activated within selected items. </em>

This will create two sliders grouped together with default settings.
    
    <div id="sliderGroup">
        <div class="slider"></div>
        <div class="slider"></div>
    </div>

    <script>
       $('#sliderGroup').groupedSliders()
    </script>

With options (using same html as above example)

    <script>
       $('#sliderGroup').groupedSliders(
       {
          startState:'unlocked',
          total: 300 // Combined value of sliders will be 300
       })
    </script>

With bound input box and lock toggle button.

    <div id="sliderGroup">
        <input type="text" class="slider-text" name="slider">
        <div class="slider"></div>
        <span class="ui-icon ui-icon-unlocked slider-lock"></span>	            

        <input type="text" class="slider-text" name="slider2">
        <div class="slider"></div>
        <span class="ui-icon ui-icon-unlocked slider-lock"></span>				
    </div>
    
    <script>
       $('#sliderGroup').groupedSliders(
       {
          startState:'unlocked',
          total: 100
       })
    </script>

#### Classes
<table>
<tr>
   <th>Class Name</th>
   <th>Description</th>
</tr>
<tr>
   <td>.slider</td>
   <td> Used by jquery-ui, applied on elements to become sliders.</td>
</tr>
<tr>
   <td>.slider-text</td>
   <td>Applied to a text input preceding a slider, this will bind the current     numerical value of the slider to the input box.</td>
</tr>
<tr>
   <td>.slider-lock</td>
   <td>Applied to an element following a slider, will convert said button into a lock / unlock toggle for the previous slider.  <em>(Note: currently designed for use with jquery UI icons, this will add the ui-icon-unlocked /  ui-icon-locked classes to the element - pending revision )</em></td>
</tr>
</table>

### Options
<table>
<tr>
   <th>Option</th>
   <th>Type</th>
   <th>Description</th>
   <th>Default</th>
</tr>
<tr>
   <td>startState</td>
   <td>String</td>
   <td>Supports 'locked' & 'unlocked', Indicated default status of sliders</td>
   <td>unlocked</td>
</tr>
<tr>
   <td>total</td>
   <td>Integer</td>
   <td>The total value to be shared by the sliders</td>
   <td>100</td>
</tr>

</table>
