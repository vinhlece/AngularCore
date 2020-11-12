var deployer = require('nexus-deployer');
var pkg= require('./package.json');
var zipFolder = require('zip-folder');
var release = {
    groupId: 'cemdo',
    artifactId: 'reporting-dashboard',
    version: pkg.version,
    packaging: 'zip',
    auth: {
      username:'JenkinsA',
      password:'9mgfV9x2Qo'
    },
    pomDir: 'dist',
    url: 'http://5.10.79.243:8081/repository/JoulicaReportingDashboard',
    artifact: 'reporting-dashboard-SNANPSHOT-'+pkg.version+'.zip',
    noproxy: 'localhost',
    cwd: ''
};
 
zipFolder('./dist', 'reporting-dashboard-SNANPSHOT-'+pkg.version+'.zip', function(err) {
    if(err) {
        console.log('Did not deploy, an Error occured', err);
    } else {
        console.log('Running Nexus Deployer');
        deployer.deploy(release, function(){
            // your async call back here
            // done();
        });
    }
});





