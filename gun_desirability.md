---
title: Justin Lucas Sola
filename: gun_desirability
layout: default

--- 
## Gun Desirability

I developed and validated an index measure of gun desirability through a large national survey experiment: *Transmitting Desire* [(Sola 2021)](https://doi.org/10.1177/07311214211007179). It has several advantages versus measure of past behavior (e.g. gun ownership) and measures of purchase intent (e.g. New Years' resolutions). You can implement it in Qualtrics quickly:

### 1) Question formatting and HTML code

Gun desirability is an index of pistol, AR-15, and hunting rifle desirability questions. These questions together in random order. Each features a horizontal sliding scale with an interval from 'No Desire' (internally recorded as 0) to 'Most Desire' (internally recorded as 100). I use 12-point font for these labels, but appropriate size depends on the rest of your survey.

For the [hunting rifle](./files/hunting_rifle.png) image I use 75% of screen width. For the [AR-15](./files/ar-15.png) image I use 70% width, with 40% for the [pistol](./files/pistol.png) image. Here is a [zip file](./files/gun_desirability_prompts.zip) containing all three prompt images.

Edit the following question HTML to suit 1) the image address once you have uploaded it to Qualtrics and 2) the appropriate relative width for the prompt in question:
```
Take a look at the gun below:
<div style="text-align: center;"><img src="[IMAGE SOURCE ADDRESS]" style="width:[RELATIVE WIDTH]%;" /></div>
<br />
Use the slider to show how desirable this gun is to you:
```

Other Qualtrics options: no value is shown to the participant, a response is 'requested' rather than 'forced', and the 'mobile-friendly' option is checked.

### 2) JavaScript code

I use Javascript to disable an initial anchor point on the slider. Replace the JavaScript section (see [here](https://www.qualtrics.com/support/survey-platform/survey-module/question-options/add-javascript/)) of each question with the following:
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

### 3) End result

There should be no default value (aka anchor point). After clicking on the slider, a handle appears to mark the value selected along the interval. See below:
<p align="center">
<img align="center" src="./files/hunting_rifle_example.png" width="90%">
</p>
