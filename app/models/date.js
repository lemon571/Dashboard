define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){

	var dateModel = Backbone.Model.extend({
		
		date: new Date(),
		
		initialize: function(ts) {
			if(_.isDate(ts)){
				this.date = ts;
			} else {
				this.date = new Date(ts*1000);
			}
		},
		
		format: function(pattern) {
			
			return _.map(pattern.split(''), this._getValue, this).join('');
		},
		
		getFancyDate: function() {
			
			var today = new Date();
			
			if(	this.date.getMonth() == today.getMonth() &&
				this.date.getYear() == today.getYear()) {
					if(this.date.getDate() == today.getDate()) 	return "Today";
					else 
					if(this.date.getDate() == today.getDate()-1) return "Yesterday";
					else 
					if(this.date.getDate() == today.getDate()+1) return "Tomorrow";
					
			}
			
			return this.format('l M j')+"<sup>"+this.format('S')+"</sup> '"+this.format('y');
			
		},
		
		_getValue: function(char) {
			
			
			var digitify = function(n) {
				
				return n.toString().length==1? '0'+n : n;
				
			}
			
			var day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			var month = ['January','February','March','April','May','June','July','August','September','October','November','December'];
			
			try {
				
			switch(char){
				
				case 'd': 
				
					return digitify(this.date.getDate());
				
				case 'D':
				
					return day[this.date.getDay()].substr(0,3);
					
				case 'j':
				
					return this.date.getDate();
					
				case 'l':
				
					return day[this.date.getDay()];
					
				case 'N':
				
					return this.date.getDay()? this.date.getDay() :7;
					
				case 'S':
				
					var ld = this.date.getDate().toString().substr(-1);
				
					if(ld==1) return 'st';
					else if(ld==2) return 'nd';
					else if(ld==3) return 'rd';
					else return 'th';
					
				case 'w':
				
					return this.date.getDate();
					
				case 'F':
				
					return month[this.date.getMonth()];
					
				case 'm':
				
					return digitify(this.date.getMonth()+1);
					
				case 'M':
					return month[this.date.getMonth()].substr(0,3);
				
				case 'n':
				
					return this.date.getMonth()+1;
				
				case 'Y':
				
					return this.date.getFullYear();
					
				case 'y':
				
					return this.date.getFullYear().toString().substr(-2);
					
				case 'a':
				
					return this.date.getHours()>=12 ?'pm' :'am';
				
				case 'A':
				
					return (this.date.getHours()>=12 ?'pm' :'am').toUpperCase();
					
				case 'g':
					var hour = 12;
					if(this.date.getHours()==0){
						hour = 12;
					} else if (this.date.getHours()<12) {
						hour = this.date.getHours();
					} else if (this.date.getHours()>12) {
						hour = Math.abs(this.date.getHours()-12);
					}
					return hour;
				
				case 'G':
				
					return this.date.getHours();
					
				case 'h':
				
					return digitify(Math.abs(this.date.getHours()-12));
					
				case 'H':
				
					return digitify(this.date.getHours());
					
				case 'i':
				
					return digitify(this.date.getMinutes());
					
				case 's':
				
					return digitify(this.date.getSeconds());
					
				case 'e':
				
					return 'GMT';
					
				case 'O':
				
					return -this.date.getTimezoneOffset()/60;
					
				case '!':
				
					return this.date.toLocaleDateString()+" "+this.date.toLocaleTimeString();
					
				default:
				
					return char;
			}
			} catch(e) {
				return null;
			}
		}
		
	});
	
	return dateModel;

});