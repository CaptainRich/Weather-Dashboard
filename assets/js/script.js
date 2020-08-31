// Javascript file for the Weather Dashboard

// Variables for the user input form.
var userCitySearchEl  = document.querySelector( "#city-form" );



////////////////////////////////////////////////////////////////////////////////////////
var getUserRepos = function ( user ) {

    // Format the GitHub API URL.
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // Make the request.
    var response = fetch(apiUrl).then(function (response) {
        if( response.ok ) {
            response.json().then(function (data) {
                displayRepos( data, user );
            });
        }
        else {
            alert( "Error: " + response.statusText );
        }

    })
	.catch( function( error) {
		// Notice this '.catch()' is chained onto the end of the '.then()'
		alert( "Unable to connect to GitHub.");
	});    
}


////////////////////////////////////////////////////////////////////////////////////////
// Define the function to the 'repo' information
var displayRepos = function( repos, searchTerm ) {

    // Check if the API returned any 'repos'
    if( repos.length === 0 ) {
        repoContainerEl.textContent = "No repositories found for this user." ;
        return;
    }

    // Clear out any earlier displayed data
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent  = searchTerm;

    // Display the repository data on the page.
    // Loop over the discovered 'repos'.
    for( i = 0; i < repos.length; i++ ) {
        // Format the 'repo' name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // Create the container for this 'repo'.
        var repoEl = document.createElement( "a" );
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // Link the next HTML page and sends it the selected 'repo' name.
        repoEl.setAttribute( "href", "./single-repo.html?repo=" + repoName );   

        // Create a span element to hold the 'repo' name
        var titleEl = document.createElement( "span" );
        titleEl.textContent = repoName;

        // Append the element to the container
        repoEl.appendChild( titleEl );

        // Now create the status element for 'repo issues'
        var statusEl = document.createElement( "span" );
        statusEl.classList = "flex-row align-center";

        // See if the repo has any issues
        if( repos[i].open_issues_count > 0 ) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // Append the status to the container
        repoEl.appendChild( statusEl );


        // Append the container to the DOM
        repoContainerEl.appendChild( repoEl );
    }

    console.log( repos );
    console.log( searchTerm );
}


////////////////////////////////////////////////////////////////////////////////////////
// Function to search GitHub based on language features.
var getFeaturedRepos = function( language ) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch( apiUrl ).then( function( response ) {
        if( response.ok ) {
            response.json().then(function(data) {
                displayRepos( data.items, language );
            })
        }
        else {
            alert( "Error: " + response.statusText );
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// Define the event handlers needed.

// The event handler for the form submit button
var formSubmitHandler = function( event ) {
    event.preventDefault();

    // Get the requested user name from the form
    var username = nameInputEl.value.trim();

    if( username ) {
        getUserRepos( username );
        nameInputEl.value = "";
    }
    else {
        alert( "Please enter a GitHub username." );
    }
    console.log( event );
}

// The event handler for the language buttons
var buttonClickHandler = function( event ) {

    // Determine which button was clicked from the button data attributes
    var language = event.target.getAttribute( "data-language" );
    
    // Invoke the API to return the requested language 'repos'
    getFeaturedRepos( language );

    // Clear out any earlier data.  The container is actually cleared before any new
    // data is displayed because 'getFeaturedRepos' runs asynchronously and will take
    // longer to finish.
    repoContainerEl.textContent = "";
}


////////////////////////////////////////////////////////////////////////////////////////
// Define the event listeners needed.

// Event listener for the GitHub user name.
userFormEl.addEventListener( "submit", formSubmitHandler );

// Event listener for the language buttons.
languageButtonsEl.addEventListener( "click", buttonClickHandler );
