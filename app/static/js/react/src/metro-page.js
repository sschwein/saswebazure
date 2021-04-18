feed_items = []

$.ajax({
    url: "api/metro/feed",
    type: 'GET'
    // headers: {
    //     'x-functions-key': backend_api_key,
    // }
}).done(function( data ) {
    feed_items = data
    console.log('found ' + String(feed_items.length) + " objects")
    ReactDOM.render(
        <ItemFeedList feed={feed_items} />,
        document.getElementById('search-panel-list')
    );
}).fail(function() {
    console.log("error loading all api data")
}).always(function() {
    console.log("finished loading all api data")
});

// class MenuContainer extends React.Component {
//     state = {
//         activeIndex: 0
//     }
  
//     homeSliderSelect = (index) => {
//         this.setState({ activeIndex: index });
//         ReactDOM.render(
//             homeSliderElements[index],
//             document.getElementById('home-slider-panel-wrap')
//         );
//         document.getElementById("home-slider-panel").scrollTo({
//             top: 0,
//             left: 0,
//             behavior: "smooth"
//         });
//     };
  
//     render() {
//         return <div className='d-flex'>
//             <MenuClickable index={0} name="About" isActive={ this.state.activeIndex===0 } onClick={ this.homeSliderSelect } />
//             <MenuClickable index={1} name="Experience" isActive={ this.state.activeIndex===1 } onClick={ this.homeSliderSelect } />
//             <MenuClickable index={2} name="Skills" isActive={ this.state.activeIndex===2 } onClick={ this.homeSliderSelect }/>
//             <MenuClickable index={3} name="Volunteerism" isActive={ this.state.activeIndex===3 } onClick={ this.homeSliderSelect }/>
//         </div>
//     }
// }

function ListItem(props) {
    item = props.value
    return (
        <div className='single-result-wrapper'>
            <div>
                <span className="font-orange" style={{"fontSize": "85%", "fontWeight": "bold"}}>{item.title}</span> - 
                <span>{item.summary}</span>
            </div>
            <br></br>
            <div className='d-flex justify-content-around w-80 mx-auto' style={{"fontSize": "85%"}}>
                <div style={{"width": "250px"}}><span className="font-weight-bold">Published on:</span> {item.published.split("T")[0]}</div>
                <div style={{"width": "250px"}}><span className="font-weight-bold">Tags:</span> {item.tags[0].term}</div>
            </div>
        </div>
    );
}

function ItemFeedList(props) {
    const feed = props.feed;
    const listItems = feed.map((item) =>
        <ListItem key={item.title} value={item} />
    );
    return (
        <div className='result-wrapper'>
            {listItems}
        </div>
    );
}

/* <div class='result-wrapper'>
    <img class='loading-img' ng-show='show_loading' src='/images/Pacman.gif'>
    <div class='error-text' ng-show='search_error' ng-cloak>Bill Search Error</div>
    <div class='single-result-wrapper' ng-repeat='row in bill_results track by $index' ng-cloak>
        <a style='font-weight:bold;color:#d85c38;cursor:pointer;' ng-click='search_load_full_bill($index)'>[[row.bill_id]]</a> - [[row.congress_term]]
        <br>
        <span style='font-size:85%;font-weight:bold;'>[[row.title]]</span>
        <br>
        <div class='ml-4' style='font-size:85%;'>
            <div>Sponsor: [[row.sponsor_name]]</div>
            <div class='d-flex'>
                <div>Introduced:  [[row.introduced_date.split('-')[1] ]]-[[row.introduced_date.split('-')[2] ]]-[[row.introduced_date.split('-')[0] ]]</div>
                <div class='ml-3'>Last Action: [[row.last_action_date.split('-')[1] ]]-[[row.last_action_date.split('-')[2] ]]-[[row.last_action_date.split('-')[0] ]]</div>
            </div>
        </div>
    </div>
</div> */