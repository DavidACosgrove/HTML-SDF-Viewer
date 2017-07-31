//
// Directives for hsvApp.
// David Cosgrove
// david@cozchemix.co.uk
//

// part of code for reading local SDFs.  Borrowed heavily from
// https://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs.
// See license on linked fiddle http://jsfiddle.net/alexsuch/6aG4x/535/
hsvApp.directive('readSdf', function($parse) {
    return {
	scope: false,
	link: function(scope, element, attrs) {
	    var fn = $parse(attrs.readSdf);
	    element.on('change', function(onChangeEvent) {
		var reader = new FileReader();
		reader.onload = function(onLoadEvent) {
		    scope.$apply(function() {
			fn(scope, {$fileContent:onLoadEvent.target.result});
		    });
		};
		filename = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
		// console.log("FN : " + filename.name);
		if(check_molecule_file_ext(filename.name)) {
		    reader.readAsText(filename);
		}
		// reader.readAsText(filename);
	    });
	}
    };
});

// check that the user has given a valid file
check_molecule_file_ext = function(filename) {
    var valid_exts = [".sdf", ".mol"];
    file_ext = filename.substring(filename.lastIndexOf('.'));
    if(valid_exts.indexOf(file_ext) < 0) {
    	alert("Invalid file selected, valid files are of " +
    	      valid_exts.toString() + " types.");
    	return false;
    }
    else return true;
};

