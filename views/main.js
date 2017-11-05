var app = angular.module('vibrationDashboard', []);
app.controller('mainCtrl', function($scope,$http) {
    $scope.Title = "Packet Details";
	  $http.get("/con")
    .then(function(response) {
       console.log(response.data)
	   $scope.JsonpacketData = response.data;
	   dataSimplify();
    });
	
	
	$scope.packetNameObj = {};
	$scope.vib_sensitive_effected_count =0;
	$scope.vib_sensitive_notEffected_count =0;
	$scope.heat_effected_count =0;
	$scope.heat_notEffected_count =0;
	$scope.light_effected_count =0;
	$scope.light_notEffected_count =0;
	EffectedPacketName = [];
	dataSimplify = function(){	

		angular.forEach($scope.JsonpacketData,function(value,index){ 
		//console.log(value)
		singlePacketName = value.MYNAME;
		//if(!packetNameArr.find(packetCheck)){
			//console.log(packetName	Obj[singlePacketName])
			switch(value.PACKETTYPE_DESC){
			case 'VIB SENSITIVE':
					if ((value.GYROX + value.ACCELZ)/2 > 50){
						value['exceeded'] = true;
						$scope.vib_sensitive_effected_count++;
						EffectedPacketName.push(singlePacketName);
					}else{
						value['exceeded'] = false;
						$scope.vib_sensitive_notEffected_count++;						
					}						
				break;	
			case 'HEAT SENSITIVE':
					if (value.HUMIDITY>70 && value.OBJECTTEMP>50){
						value['exceeded'] = true;
						$scope.heat_effected_count++;
						EffectedPacketName.push(singlePacketName);
					}else{
						value['exceeded'] = false;
						$scope.heat_notEffected_count++;						
					}
				break;	
			case 'LIGHT SENSITIVE':
					if (value.HUMIDITY>70 && value.LIGHT>50){
						value['exceeded'] = true;
						$scope.light_effected_count++;
						EffectedPacketName.push(singlePacketName);
					}else{
						value['exceeded'] = false;
						$scope.light_notEffected_count++;						
					}
				break;	
		
		} // switch case end

			if($scope.packetNameObj[singlePacketName] == undefined) $scope.packetNameObj[singlePacketName] = []; 
				$scope.packetNameObj[singlePacketName].push(value);						
	});
	console.log($scope.packetNameObj);
	console.log("vib:effected:"+$scope.vib_sensitive_effected_count);console.log("vib:not:effected"+$scope.vib_sensitive_notEffected_count);
	console.log("heat:effected:"+$scope.heat_effected_count);console.log("heat:not:effected"+$scope.heat_notEffected_count);
	console.log("light:effected:"+$scope.light_effected_count);console.log("light:not:effected"+$scope.light_notEffected_count);
	 
	  //meterGuage start
	  var vibCount=($scope.vib_sensitive_effected_count/($scope.vib_sensitive_effected_count+$scope.vib_sensitive_notEffected_count));
	  var heatCount = ($scope.heat_effected_count/($scope.heat_effected_count+$scope.heat_notEffected_count));
	  var lightCount = $scope.light_effected_count/($scope.light_effected_count+$scope.light_notEffected_count);
	 
	 var vib_meterVal = parseInt(vibCount == 0.5? 0:(vibCount > 0.5 ? vibCount*80 : (vibCount < 0.5 ? vibCount*80-80 : -80)));
	 var heat_meterVal = parseInt(heatCount == 0.5? 0:(heatCount > 0.5 ? heatCount*80 : (heatCount < 0.5 ? heatCount*80-80 : -80)));
	 var light_meterVal = parseInt(lightCount == 0.5? 0:(lightCount > 0.5 ? lightCount*80 : (lightCount < 0.5 ? lightCount*80-80 : -80)));
	 $scope.vibGuage = vib_meterVal >0 ?["gauge-red","transform: rotate("+vib_meterVal+"deg)"]:["gauge-green","transform: rotate("+vib_meterVal+"deg)"]; 
	 $scope.heatGuage = heat_meterVal >0 ?["gauge-red","transform: rotate("+heat_meterVal+"deg)"]:["gauge-green","transform: rotate("+heat_meterVal+"deg)"]; 
	 $scope.lightGuage = light_meterVal >0 ?["gauge-red","transform: rotate("+light_meterVal+"deg)"]:["gauge-green","transform: rotate("+light_meterVal+"deg)"]; 
	 //meterGuage end 
	 
	}; // dataSimplify function End..

	$scope.turnRed = function(valName){							
			function checkFun(name) {
				 if(name == valName){
					 return true;
				 };
			};
			 if(EffectedPacketName.find(checkFun)){
				return true;
			 }else{return false;}		
	}; //turnRed fun end
	
 	$scope.PacketLoad = function(packetName){
			$scope.packetDetail = $scope.packetNameObj[packetName];
		//console.log($scope.packetDetail)
	};
	 
	$scope.ShowMsg = function(name,data){
		function checkFun(valName) {
					 if(name == valName){
						 return true;
					 };
				};
		if(data[0].PACKETTYPE_DESC == 'VIB SENSITIVE' && (EffectedPacketName.find(checkFun))){		
			$scope.message = "packet have exceeded permissible vibration range";
		}	if(data[0].PACKETTYPE_DESC == 'LIGHT SENSITIVE' && (EffectedPacketName.find(checkFun))){
				$scope.message = "Packet is exposed to direct sunlight and high humidity";
			}	if(data[0].PACKETTYPE_DESC == 'HEAT SENSITIVE' && (EffectedPacketName.find(checkFun))){
					$scope.message = "Packet is exposed to intense heat and humidity";
				}
		};
	$scope.changeColordrop = function(){$scope.message=null};	
	
});//End of MainCntrl..c**l..