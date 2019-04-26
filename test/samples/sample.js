'use strict';

module.exports = `
<html>
    <title>Data Scientist</title>
    <company>Beamery</company>
    <body>
        <p class="firstName">Ahmad</p>
        <p class="middleName">Ahmad</p>
        <div id="lastName">Assaf</div>
        <article id="bio" data-bio=" "></article>
        <email>ahmad.a.assaf@gmail.com</email>
        <ul>
            <li>We shouldn't be parsing this</li>
        </ul>
        <ul id="links">
            <li class="link">http://a.com</li>
            <li class="link">http://b.com</li>
            <li class="link">http://c.com</li>
        </ul>
        <ul data-class="social_links">
            <li class="link" value="http://github.com/ahmadassaf">Github</li>
            <li class="link" value="http://twitter.com/ahmadaassaf">Twitter</li>
            <li class="link">google</li>
        </ul>
        <article class="linksv2">
            <ul></ul>
            <ul>
                <li id="54b931981f03e4416a53c3096a32b134" data-service="twitter" type="social">https://twitter.com/ahmadaassaf</li>
                <li id="54b931981f03e4416a53c3096a32b135" data-service="twitter" type="social">https://twitter.com/ahmadaassaf</li>
                <li id="e9a5737987d042c6da01f3e740f3f7f7" data-service="gravatar" type="website">https://gravatar.com/ahmadassaf</li>
                <li id="f5e32a6faaa7ead6ba201e8fa25733ee" data-service="klout" type="website">http://klout.com/ahmadassaf</li>
                <li id="e960af6e-c99f-4981-81b3-0b09d99d7354" data-service="skype">ahmad.a.assaf</li>
                <li id="ce621e6d5d201a8212c3684b2a40c813" data-service="seed" type="website" deleted=true>http://ahmadassaf.com</li>
            </ul>
        </article>
        <div>
            <div>
                <ul id="work">
                    <li>
                       <span>beamery</span>
                       <span>Data Scientist</span>
                       <span class="workData">2015-08-28</span>
                       <span>true</span>
                    </li>
                    <li>
                        <span>SAP</span>
                        <span>Associate Researcher</span>
                        <span>false</span>
                    </li>
                </ul>
                <ul class="education">
                    <li>
                        <span>telecomParisTech</span>
                        <span>phd</span>
                        <span>france</span>
                    </li>
                    <li>
                        <span>University of St.Andrews</span>
                        <span>masters</span>
                    </li>
                </ul>
            </div>
        </div>
        <photo>http://a photo .com</photo>
    </body>
</html>
`