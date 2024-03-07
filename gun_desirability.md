---
title: Justin Lucas Sola
filename: gun_desirability
layout: default

--- 
### Gun Desirability

There are many advantages to capturing gradations of desire for guns rather than measuring past behavior (e.g. gun ownership) or asking what a participant will do (e.g. measures of intent). I developed and validated an index measure of gun desirability through a large national survey experiment: *Transmitting Desire* [(Sola 2021)](https://doi.org/10.1177/07311214211007179). If you use the measure, please cite it! Implementing in Qualtrics takes only a few minutes:

## Question formatting and HTML code

Gun desirability is an index of three intervals measures. Each features one of three firearms: a pistol, an AR-15, and a hunting rifle. Each question prompts the participant to click and drag a horizontal sliding scale from 'No Desire' (lefthand side, internally recorded as 0) to 'Most Desire' (righthand side, internally recorded as 100). The questions are presented simultaneously and randomly ordered.

Other relevant settings: no value is shown to the participant, a response is 'requested' rather than 'forced', and the mobile-friendly option is checked. To adapt to different devices, I use a relative width setting (rather than absolute pixel counts) to display each firearm image.

For the [hunting rifle image](./files/hunting_rifle.png) I use 75% width (the code below reflects this). For the [AR-15 image](./files/ar-15.png) I use 70% width, with 40% for the [pistol image](./files/pistol.png). You can copy-paste the HTML below and edit the proper 1) the source image address and 2) relative width:
```
Take a look at the gun below:
<div style="text-align: center;"><img src="[ADDRESS OF IMAGE SOURCE]" style="width:75%;" /></div>
<br />
Use the slider to show how desirable this gun is to you:
```

I set the labels ('No Desire' at the left, 'Most Desire' at the right) to 12-point font to make sure they are not too small. The appropriate font size depends on the formatting of the rest of your survey.

## JavaScript code

I use the following JavaScript code for each question. Just copy-paste:
```
/* hides slider 'handle' until participants clicks 
Qualtrics.SurveyEngine.addOnload(function()
{
	var q = jQuery("#"+this.questionId);
	q.find(".handle").css('visibility', 'hidden');
	q.find(".track").on("click , touchstart", function() {
	jQuery(this).find(".handle").css('visibility', 'visible');
});

/* 1st default block
Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
});

/* 2nd default block
Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/
});
```

## End result

When participants encoutner the question, there should be no default value (aka anchor point). After clocking on the slider, a handle appears to mark the value selected along the interval. See an example below:
<img src="./files/hunting_rifle_example.png 1177w" 
  align="center"
  style="max-width:1177px;width:76%;height:auto;padding:8px">
