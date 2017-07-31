//
// Controller for hsvApp
// David Cosgrove
// david@cozchemix.co.uk
//

hsvApp.controller("hsvCtrl", ['$scope', '$window',  function($scope, $window) {
    // The $window variable is needed because jsmeApplet is defined outside
    // of the angularJS code.  Because of the asynchronous way the page is
    // built, this code may be called before the page is finished so we can't
    // reliably take a copy of $window.jsmeApplet for use later, so we'll
    // carry on using it directly.  It doesn't feel right, but that's not its problem.
    console.log("hsvCtrl");
    $scope.whole_sdf = "";
    $scope.fileContent = "";

    $scope.loadStartStructure = function( ) {
	console.log("loadStartStructure");
	$window.jsmeApplet.readMolecule( $scope.startingStructure );
    };

    // part of code for reading local SDFs.  Borrowed heavily from
    // https://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs
    // Named as attribute value by file input tag in html, called by directive named
    // in input tag.
    $scope.parseSDF = function($fileContent) {
	console.log("parseSDF");
	$scope.whole_sdf = $fileContent;
	$scope.sdf_records = split_sdf($scope.whole_sdf);
	$scope.mol_tagged_data = $scope.sdf_records.tagged_data;
	$scope.sdf_mols = $scope.sdf_records.mol_records;
	show_molecule();
    };

    $scope.firstMolCounter = function() {
	$scope.mol_counter = 0 ;
	show_molecule();
    };
    $scope.incrementMolCounter = function(step_size) {
	if($scope.mol_counter < $scope.sdf_mols.length - step_size) {
	    $scope.mol_counter += step_size ;
	    show_molecule();
	}
    };
    $scope.decrementMolCounter = function(step_size) {
	if($scope.mol_counter >= step_size) {
	    $scope.mol_counter -= step_size;
	    show_molecule();
	}
    };
    $scope.lastMolCounter = function() {
	$scope.mol_counter = $scope.sdf_mols.length - 1;
	show_molecule();
    };

    $scope.setMolCounter = function(new_val) {
	if(new_val >= 0 && new_val < $scope.sdf_mols.length) {
	    $scope.mol_counter = new_val;
	    show_molecule();
	}
	
    }
    
    show_molecule = function() {
	$window.jsmeApplet.readMolFile( $scope.sdf_records.mol_records[$scope.mol_counter] );
    }
    
    // take an SDF and split it into individual MOL records, and array of objects
    // containing tagged data
    split_sdf = function(sdf_contents) {

	$scope.all_sdf_tags = [];
	$scope.mol_tagged_data = [];
	$scope.sdf_mols = [];
	$scope.mol_counter = 0;
	
	var mol_records = [];
	var tagged_data = [];

	sdf_contents = sdf_contents.replace(/\r?\n/g, '\n');
	var sdf_lines = sdf_contents.split( /\r?\n/g );
	console.log( "Number of lines " + sdf_lines.length );
	var sdf_lines = sdf_contents.split( '\n' );
	console.log( "Number of lines " + sdf_lines.length );
	next_mol = [];
	var mol_num = 0;
	if(-1 == $scope.all_sdf_tags.indexOf('Number')) {
	    $scope.all_sdf_tags.push('Number');
	}
	
	for(i = 0; i < sdf_lines.length; i++) {
	    next_mol.push(sdf_lines[i]);
	    if(sdf_lines[i].trim() == "M  END") {
		// end of MOL record, so extract some into if available, save it
		// and reset
		var mol_td = {Number: mol_num};
		if(next_mol[0].trim().length > 0) {
		    mol_td.Name = next_mol[0].trim();
		    if(-1 == $scope.all_sdf_tags.indexOf('Name')) {
			$scope.all_sdf_tags.push('Name');
		    }
		}
		mol_records.push(next_mol.join('\n'));
		next_mol = [];
		mol_num++;

		// there may be some tagged data if it's an SDF
		for (; i < sdf_lines.length; i++) {
		    if(sdf_lines[i].trim() == "$$$$") {
			break;
		    }
		    if(0 == sdf_lines[i].indexOf('> <')) {
		    	var tag = sdf_lines[i].trim().replace('> <', '').replace('>', '');
			if(-1 == $scope.all_sdf_tags.indexOf(tag)) {
			    $scope.all_sdf_tags.push(tag);
			}
		    	// console.log("Tag : " + tag);
			var data = '';
			i++;
			for(; i < sdf_lines.length; i++) {
			    var nl = sdf_lines[i].trim();
			    if(0 == nl.length || nl == '$$$$') {
				break;
			    }
			    data += sdf_lines[i];
			}
			mol_td[tag] = data;
		    }
		}
		// we've read all the tagged data for this molecule
		// console.log("final mol_td : " + JSON.stringify(mol_td));
		tagged_data.push(mol_td);
	    }
	}
	
	console.log( "Number of molecules " + mol_records.length );
	console.log( "Number of tagged data records " + tagged_data.length );
	return { mol_records:mol_records, tagged_data:tagged_data };
    };

}]);
