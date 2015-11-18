$('.site_footer-tour').click(function(){
    guiders.createGuider({
        attachTo: "nav",
        title: "Navigation",
        description: "Welcome to Arda Maps. This lightweight navigation is all you need to get to know more about this project.",
        buttons: [{name: "Close"},{name: "Next"}],
        position: "bottom",
        id: "tip_nav",
        next: "tip_nav_ages",
        onClose: $(".guiders_buttons_container .guiders_button").remove(),
        overlay: true,
        width: 250,
        closeOnEscape: true
    }).show();
    guiders.createGuider({
        attachTo: "#menu2ages",
        title: "Choose an age",
        description: "Choose one of the three given ages. As you can see it is loading without refreshing the page. Let's take the Third Age where Lord of the Rings took place.",
        buttons: [{name: "Back"},{name: "Next"}],
        position: "right",
        id: "tip_nav_ages",
        next: "tip_buttons",
        width: 300,
        closeOnEscape: true
    });
    guiders.createGuider({
        attachTo: "#bottomButtons",
        title: "Map utilities",
        description: "Use the given functions to control the current map.",
        buttons: [{name: "Back"},{name: "Next"}],
        position: "top",
        id: "tip_buttons",
        next: "tip_button_journey",
        overlay: true,
        width: 300,
        closeOnEscape: true
    });
    guiders.createGuider({
        attachTo: "#journeybutton",
        title: "Journeys",
        description: "Let's have a look where Frodo & Sam walked along. So simply choose them from the list.",
        buttons: [{name: "Back"},{name: "Next"}],
        position: "right",
        id: "tip_button_journey",
        next: "tip_infotimeline",
        width: 500,
        closeOnEscape: true
    });
    guiders.createGuider({
        attachTo: "#infobuttons",
        title: "Additional content",
        description: "These buttons give extra information about the current age or any character and location.",
        buttons: [{name: "Back"},{name: "Next"}],
        position: "left",
        id: "tip_infotimeline",
        next: "tip_timeline",
        overlay: true,
        width: 300,
        closeOnEscape: true
    });
    guiders.createGuider({
        attachTo: "#timelinebutton",
        title: "Timeline",
        description: "The timeline will show you all important events that happened in the current age. It also interacts with the world. Click on it.",
        buttons: [{name: "Back"},{name: "Next"}],
        position: "left",
        id: "tip_timeline",
        next: "tip_donate",
        width: 300,
        closeOnEscape: true
    });
    guiders.createGuider({
        attachTo: "#donate",
        title: "Contribute",
        description: "The project was an awesome experience. But anyway this website costs some bucks. Donations are welcome my friend. Anyway I hope you like this page and feel free to share it. Thank you :)",
        buttons: [{name: "Back"},{name: "Close"}],
        position: "left",
        id: "tip_donate",
        width: 400,
        closeOnEscape: true
    });
});