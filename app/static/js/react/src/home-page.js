function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

homeSliderElements = {
    0:(
        <div className='slider-panel'>
            <div className="d-flex w-800-center">
                <div className="col-md-4 mx-auto">
                    <img className='headshot' height="280" width="280" src='/static/images/basic/headshot_new_400.jpg' />
                </div>
                <div className="col-md-6 mx-auto">
                    <br /><br />
                    <p className="font-size-110">
                        <strong>Name:</strong><br />
                        <span>Steven Schweinhart</span><br />
                        <strong>Education:</strong><br />
                        <span>Masters of Engineering</span><br /><span>Computer Engineering & Computer Science</span><br />
                        <strong>Location:</strong><br />
                        <span>Louisville, KY, USA</span>
                    </p>
                </div>
            </div>
            <div className='w-700-center text-justify font-size-125'>
                <p className='my-5'>I am a software engineer based in Louisville KY that enjoys building tools to solve problems. This includes building video games for school projects to this website.</p>
                <p className='my-5'>Over the past decade as a programmer, I have built up a collection of projects scattered across my many computers. This has made it difficult to showcase my work at its best. I plan on using this domain to host all of my ideas in one place. </p>
                <p className='my-5'>When I'm not sitting in front of a screen I find myself exploring on my bike, distracted online, enjoying a bottle of wine, or finding an excuse to cook Indian food (chicken curry and naan is my weakness).</p>
            </div>
        </div>
    ),
    1: (
        <div className='slider-panel'>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/impact_kentucky.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://impact-ky.com' target='_blank'>Impact Kentucky</a></h5>
                    <div className='home-section-subhead1 font-green'>CTO/Cofounder - Since 2020</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>Impact Kentucky was founded in 2020 to help political candidates running for office. We currently offer services for data consulting, audience targetting, and digital advertising. As CTO my focus is on developing the technical architecture of our digital platforms hosted in Microsoft's Azure and Power Platform.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/humana.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://www.humana.com' target='_blank'>Humana</a></h5>
                    <div className='home-section-subhead1 font-green'>Software Engineer - Since 2018</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>I worked as a Software Engineer inside the Digital Health & Analytics Organization. My team created a data science platform for our data scientists and managed exiting data analytics solutions. My focus was automating legacy data solutions using Python; engineering new analytics solutions using frameworks like Airflow, Pyspark, and Django; and implementing Python packages to facilitate data science projects.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/glasscapitol.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://glasscapitol.org' target='_blank'>Glass Capitol</a></h5>
                    <div className='home-section-subhead1 font-green'>CTO/Cofounder - 2016-2018</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>Glass Capitol is a digital civic engagement platform dedicated to helping grassroots organizations effectively leverage the voices of their members. As CTO my focus was leading the development of the website's technical framework.  This included designing and building the site back-end using Google App Engine's Python web framework; leading a team of developers with site development; and helping to create the site front-end using HTML5, CSS, and AngularJS. </div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/humanamilitary.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://www.humanamilitary.com/' target='_blank'>Humana Military</a></h5>
                    <div className='home-section-subhead1 font-green'>Applications Engineer – 2016-2018</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>At Humana Military I worked as a member of a BI reporting team. My responsibilities involved creating and maintaining reports for both government and business users. Data movement and ingestion was performed with SSIS, data querying was performed with MS SQL, and the reports were generated using Actuate E.Report software and Microsoft Excel.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left' style={{background: "none"}}>
                    <img src='/static/images/logos/speedschool.jpeg' style={{maxWidth: "300px", maxHeight: "200px", borderRadius: "40px"}} />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://louisville.edu/speed/computer' target='_blank'>University of Louisville J.B. Speed School of Engineering</a></h5>
                    <div className='home-section-subhead1 font-green'>M.Eng. Computer Engineering & Computer Science – 2016</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>My graduate year at U of L challenged me, expanding my knowledge of computer engineering topics like machine learning, parallel programming, and network security. For my master's project I applied a genetic learning algorithm to create a lossy compression algorithm. While the resulting algorithm was ineffective as a form of compression, it could be improved with more iterations.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/louisville.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://louisville.edu/speed/computer' target='_blank'>University of Louisville J.B. Speed School of Engineering</a></h5>
                    <div className='home-section-subhead1 font-green'>B.S. Computer Engineering & Computer Science – 2011-2015</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>University of Louisville is where I fostered my love for engineering. My course work taught me the foundations of computer science that I needed in my day to day work as a computer engineer. I was able to grow my skills through projects such as creating a doodlebot, building an AI to play Tetris, and creating VR video games.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left'>
                    <img src='/static/images/logos/siemens.png' />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://www.mobility.siemens.com/mobility/global/en/rail-solutions/rail-automation/pages/rail-automation.aspx' target='_blank'>Siemens Rail Automation</a></h5>
                    <div className='home-section-subhead1 font-green'>Cooperative Education Intern – 2013-2015</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>During my undergraduate years at UofL, I participated in their co-operative education program as an intern at Siemens Rail Automation. Over three semesters, I designed and constructed a Factory Testing Simulator for a subway interlocking control project. I also redesigned the testing simulator for training subway operators upon installation of the final interlocking project.</div>
                </div>
            </div>
            <div className='experience-cell-wrap'>
                <div className='experience-cell-left' style={{background: "none"}}>
                    <img src='/static/images/logos/manual.png' style={{maxWidth: "300px", maxHeight: "200px", borderRadius: "40px"}} />
                </div>
                <div className='experience-cell-right'>
                    <h5 className='home-section-subhead'><a href='https://louisville.edu/speed/computer' target='_blank'>duPont Manual High School</a></h5>
                    <div className='home-section-subhead1 font-green'>Diploma: Math, Science, & Technology Magnet – 2007-2011</div>
                    <div className='home-section-subhead2 font-grey'>Louisville, KY</div>
                    <div className='home-section-p'>Participating in the Math, Science, and Technology (MST) magnet at Manual was a strenuous 4 years that pushed me to adapt and grow into an adult. I enjoyed and learned a lot from extracurricular activities like Science Fair, Science Olympiad, and Key Club. I also discovered my love for computer programming at Manual, leading me to pursue it in college and later in my career.</div>
                </div>
            </div>
        </div>
    ),
    2: (
        <div className='slider-panel'>
            <div className='interests-panel-section-whole'>
                <div className='interests-panel-image-row'>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/angularjs_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/docker_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/gcp_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/git_tint.png' /></div>
                </div>
                <div className='interests-panel-image-row'>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/hadoop_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/java_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/python_tint.png' /></div>
                    <div className='interests-image-wrap'><img className='interests-image' src='/static/images/logos/spark_tint.png' /></div>
                </div>
            </div>
            <div className='d-flex' className="interests-panel-list-wrapper">
                <div className='interests-panel-section'>
                    <h4>Day to Day Experience</h4>
                    <ul>
                        <li>Data Engineering</li>
                        <li>Natural Language Processing</li>
                        <li>Serverless Computing</li>
                        <li>NoSQL Databases</li>
                        <li>Python</li>
                        <li>Microsoft Azure</li>
                        <li>Databricks</li>
                        <li>Pyspark</li>
                        <li>HTML5/CSS3</li>
                        <li>Javascript/AJAX</li>
                        <li>Git</li>
                        <li>REST APIs</li>
                        <li>Full Stack Web Development</li>
                        <li>Azure Dev Ops</li>
                        <li>Docker</li>
                    </ul>
                </div>
                <div className='interests-panel-section'>
                    <h4>Other Experience</h4>
                    <ul>
                        <li>Google Cloud Platform</li>
                        <li>Machine Learning</li>
                        <li>React</li>
                        <li>AngularJs</li>
                        <li>Java</li>
                        <li>C/C++</li>
                        <li>C#</li>
                        <li>Cyber Security</li>
                    </ul>
                </div>
            </div>
        </div>
    ),
    3: (
        <div className='slider-panel'>
            <div id='vol-table'>
                <div className="vol-row">
                    <div className="vol-cell">
                        <h5 className='home-section-subhead3 font-orange'>Kentuckians for the Commonwealth</h5>
                        <div className='home-section-subhead1 font-green'>Member and Work Team Coordinator</div>
                        <div className='home-section-subhead2 font-grey'>2017-2021; Louisville, KY</div>
                    </div>
                    <div className="vol-cell">
                        <h5 className='home-section-subhead3 font-orange'>Code Louisville</h5>
                        <div className='home-section-subhead1 font-green'>Python Cohort Mentor</div>
                        <div className='home-section-subhead2 font-grey'>2017-2018; Louisville, KY</div>
                    </div>
                    <div className="vol-cell">
                        <h5 className='home-section-subhead3 font-orange'>Josie Raymond for KY State House</h5>
                        <div className='home-section-subhead1 font-green'>Campaign Volunteer</div>
                        <div className='home-section-subhead2 font-grey'>2018; Jeffersontown, KY</div>
                    </div>
                </div>
                <div className="vol-row">
                    <div className="vol-cell">
                        <h5 className='home-section-subhead3 font-orange'>Ryan Fenwick for Mayor</h5>
                        <div className='home-section-subhead1 font-green'>Campaign Volunteer</div>
                        <div className='home-section-subhead2 font-grey'>2018; Louisville, KY</div>
                    </div>
                    <div className="vol-cell">
                        <h5 className='home-section-subhead3 font-orange'>Boy Scouts of America</h5>
                        <div className='home-section-subhead1 font-green'>Eagle Scout Project</div>
                        <div className='home-section-subhead2 font-grey'>2010; Louisville, KY</div>
                    </div>
                </div>
            </div>
        </div>
    )
};

projectSliderElements = {
    0:(
        <div className='slider-panel'>
            <h3>Run With Craig</h3>
            <div className="slider-panel-img"><img src="/static/images/scrn/runwithcraig.png"></img></div>
            <p className="font-size-110">
                Run With Craig is an interactive map that was used by the Greenberg 2022 Mayoral campaign. It tracks all of the routes that Craig Greenberg ran with consitiuents while campaigning. The map uses the Google Maps Javascript API to plot the routes, and Geopandas for route processing and aggregation.
                <br /><a className="font-weight-bold" href="https://greenberg-api-dev.azurewebsites.net/map" target="_new">Explore</a>
            </p>
        </div>
    ),
    1:(
        <div className='slider-panel'>
            <h3>Rachel Roarx for Kentucky 38</h3>
            <div className="slider-panel-img"><img src="/static/images/scrn/rachelroarx.png"></img></div>
            <p className="font-size-110">
                This is a campaign website I designed and built in 2022 for Rachel Roarx's candidacy for KY State House. The landing page is made with HTML5 and CSS hosted in Microsoft's Azure Platform
                <br /><a className="font-weight-bold" href="https://rachelroarx.com" target="_new">Explore</a>
            </p>
        </div>
    ),
    2:(
        <div className='slider-panel'>
            <h3>Schweinhart Farms</h3>
            <div className="slider-panel-img"><img src="/static/images/scrn/schweinhartfarms.png"></img></div>
            <p className="font-size-110">
                Schweinhart Farms is a fun website I built for myself and my family to host and share recipes with each other. The website is made using HTML5 and CSS using a NoSQL database as the backend. 
                <br /><a className="font-weight-bold" href="https://schweinhartfarms.com" target="_new">Explore</a>
            </p>
        </div>
    ),
};

class MenuContainer extends React.Component {
    state = {
        activeIndex: 0
    }
  
    homeSliderSelect = (index) => {
        this.setState({ activeIndex: index });
        ReactDOM.render(
            homeSliderElements[index],
            document.getElementById('home-slider-panel-wrap')
        );
        document.getElementById("home-slider-panel").scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    };
  
    render() {
        return <div className='d-flex'>
            <MenuClickable index={0} name="About" isActive={ this.state.activeIndex===0 } onClick={ this.homeSliderSelect } />
            <MenuClickable index={1} name="Experience" isActive={ this.state.activeIndex===1 } onClick={ this.homeSliderSelect } />
            <MenuClickable index={2} name="Skills" isActive={ this.state.activeIndex===2 } onClick={ this.homeSliderSelect }/>
            <MenuClickable index={3} name="Volunteerism" isActive={ this.state.activeIndex===3 } onClick={ this.homeSliderSelect }/>
        </div>
    }
}

class ProjectContainer extends React.Component {
    state = {
        activeIndex: 0
    }
  
    projectSliderDecrement = () => {
        if (this.state.activeIndex > 0) {
            var new_index = this.state.activeIndex - 1
            this.setState({ activeIndex: new_index });
            ReactDOM.render(
                projectSliderElements[new_index],
                document.getElementById('project-slider-panel')
            );
        } else {
            console.log("already at the bottom")
        }
    };
    
    projectSliderIncrement = () => {
        if (this.state.activeIndex < 2) {
            var new_index = this.state.activeIndex + 1
            this.setState({ activeIndex: new_index });
            ReactDOM.render(
                projectSliderElements[new_index],
                document.getElementById('project-slider-panel')
            );
        } else {
            console.log("already at the top")
        }
    };
  
    render() {
        return <div className='d-flex'>
            <div className="left-menu-button font-size-125" onClick={ this.projectSliderDecrement }> {"<<"} </div>
            <div className="right-menu-button font-size-125" onClick={ this.projectSliderIncrement }> {">>"} </div>
            <div id="project-slider-panel"></div>
        </div>
    }
}
  
class MenuClickable extends React.Component {
    homeSliderSelect = () => this.props.onClick(this.props.index)
    
    render() {
        return <div
        className={
            this.props.isActive ? 'thick-bottom-border slider-header-cell' : 'slider-header-cell'
        }
        onClick={ this.homeSliderSelect }
        >
            <h4>{ this.props.name }</h4>
        </div>
    }
}

// Load the first window by default
ReactDOM.render(
    homeSliderElements[0],
    document.getElementById('home-slider-panel-wrap')
);
ReactDOM.render(<MenuContainer />, document.getElementById('home-slider-header'))
ReactDOM.render(<ProjectContainer />, document.getElementById('project-slider-panel-wrap'))
ReactDOM.render(
    projectSliderElements[0],
    document.getElementById('project-slider-panel')
);
