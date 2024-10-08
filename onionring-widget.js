// onionring.js is made up of four files - onionring-widget.js (this one!), onionring-index.js, onionring-variables.js and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (蒜) house, last updated 2020-11-24

// === ONIONRING-WIDGET ===
//this file contains the code which builds the widget shown on each page in the ring. ctrl+f 'EDIT THIS' if you're looking to change the actual html of the widget

async function onionRing() {

  const jsonRes = await fetch('https://chaiaeran.github.io/Eggbug-Eggring/eggsites.json')

  var sites = await jsonRes.json()

  //the name of the ring
  var ringName = 'Eggbug Eggring';

  /* the unique ID of the widget. two things to note:
   1) make sure there are no spaces in it - use dashes or underscores if you must
   2) remember to change 'webringid' in the widget code you give out and all instances of '#webringid' in the css file to match this value!*/
  var ringID = 'eggbug-eggring';

  //should the widget include a link to an index page?
  var useIndex = false;
  //the full URL of the index page. if you're not using one, you don't have to specify anything here
  var indexPage = 'https://example.com/index.html';

  //should the widget include a random button?
  var useRandom = true;


  var tag = document.getElementById(ringID); //find the widget on the page

  thisSite = window.location.href; //get the url of the site we're currently on
  thisIndex = null;

  // go through the site list to see if this site is on it and find its position
  for (i = 0; i < sites.length; i++) {
    if (thisSite.startsWith(sites[i])) { //we use startswith so this will match any subdirectory, users can put the widget on multiple pages
      thisIndex = i;
      break; //when we've found the site, we don't need to search any more, so stop the loop
    }
  }

  //if we didn't find the site in the list, the widget displays a warning instead
  if (thisIndex == null) {
    tag.insertAdjacentHTML('afterbegin', `
  <table>
    <tr>
      <td>This site isn't part of the ${ringName} webring yet. You should talk to the manager to have your site added to the list!</td>
    </tr>
  </table>
    `);
  }
  else {
    //find the 'next' and 'previous' sites in the ring. this code looks complex
    //because it's using a shorthand version of an if-else statement to make sure
    //the first and last sites in the ring join together correctly
    previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
    nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

    indexText = ""
    //if you've chosen to include an index, this builds the link to that
    if (useIndex) {
      indexText = `<a href='${indexPage}'>index</a> | `;
    }

    let siteStrings = sites.map((string) => `"${string}"`)

    randomText = ""
    //if you've chosen to include a random button, this builds the link that does that
    if (useRandom) {
      randomText = `<a href='javascript:void(0)' onclick='randomSite([${siteStrings}], ${thisIndex})'>random</a> | `;
    }

    //this is the code that displays the widget - EDIT THIS if you want to change the structure
    tag.insertAdjacentHTML('afterbegin', `
    <table>
      <tr>
        <td class='webring-prev'><a href='${sites[previousIndex]}'>← previous</a></td>
        <td class='webring-info'>This site is part of the <img src="https://chaiaeran.github.io/Eggbug-Eggring/eggring.png" alt="Eggbug Eggring"></br>
        <span class='webring-links'>
          ${randomText}
          ${indexText}
          <a href='https://garlic.garden/onionring/'>what is this?</a></span></td>
        <td class='webring-next'><a href='${sites[nextIndex]}'>next →</a></td>
      </tr>
    </table>
    `);

  }
}

function randomSite(sites, thisIndex) {
  otherSites = sites.slice(); //create a copy of the sites list
  otherSites.splice(thisIndex, 1); //remove the current site so we don't just land on it again
  randomIndex = Math.floor(Math.random() * otherSites.length);
  location.href = otherSites[randomIndex];
}

onionRing()