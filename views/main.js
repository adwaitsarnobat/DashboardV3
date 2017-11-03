var app = angular.module('vibrationDashboard', []);
app.controller('mainCtrl', function($scope) {
    $scope.Title = "Vibration Dashboard";
$scope.packets=[
{
MyName:"PACKET1",
type:"VIB Sensitive",
AMBIENTTEMP:[45,43,45,44,43],
OBJECTTEMP:[23,24,23,22,21],
HUMIDITY:[65,71,80,66,72],
	ACCELX	:[23,24,23,22,21],
	ACCELY	:[23,24,23,22,21],
	ACCELZ	:[53,24,23,53,21],
	GYROX	:[19,22,32,12,22],
	GYROY	:[12,12,12,13,12],
	GYROZ	:[11,14,13,49,33],
	MAGX	:[23,24,23,22,21],
	MAGY	:[23,24,23,22,21],
	MAGZ	:[23,24,23,22,21],
	LIGHT	:[23,24,23,22,21],
	TIMESENT	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	TIMEAUTO	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	LATTITUDE	:[30.2922902,30.2922902,34.723881,34.723881,34.723881,34.723881],
	LONGITUDE	:[-97.9071442,-97.9071442,-97.9071442,-97.9071442,-97.9071442],
	PACKETTYPE	:[],
	PACKETTYPE_DESC:[]
},
{
MyName:"PACKET2",
type:"LIGHT Sensitive",
AMBIENTTEMP:[45,43,45,44,43],
OBJECTTEMP:[23,24,23,22,21],
HUMIDITY:[75,71,80,66,72],
	ACCELX	:[23,24,23,22,21],
	ACCELY	:[23,24,23,22,21],
	ACCELZ	:[23,24,23,22,21],
	GYROX	:[19,22,32,12,22],
	GYROY	:[12,12,12,13,12],
	GYROZ	:[11,14,13,21,33],
	MAGX	:[23,24,23,22,21],
	MAGY	:[23,24,23,22,21],
	MAGZ	:[23,24,23,22,21],
	LIGHT	:[49,24,45,22,21],
	TIMESENT	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	TIMEAUTO	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	LATTITUDE	:[30.2922902,30.2922902,34.723881,34.723881,34.723881,34.723881],
	LONGITUDE	:[-97.9071442,-97.9071442,-97.9071442,-97.9071442,-97.9071442],
	PACKETTYPE	:[],
	PACKETTYPE_DESC:[]
},
{
MyName:"PACKET3",
type:"Heat Sensitive",
AMBIENTTEMP:[45,43,45,44,43],
OBJECTTEMP:[53,24,23,22,51],
HUMIDITY:[75,71,80,66,72],
	ACCELX	:[23,24,23,22,21],
	ACCELY	:[23,24,23,22,21],
	ACCELZ	:[23,24,23,22,21],
	GYROX	:[19,22,32,12,22],
	GYROY	:[12,12,12,13,12],
	GYROZ	:[11,14,13,21,33],
	MAGX	:[23,24,23,22,21],
	MAGY	:[23,24,23,22,21],
	MAGZ	:[23,24,23,22,21],
	LIGHT	:[23,24,23,22,21],
	TIMESENT	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	TIMEAUTO	:["10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM","10/25/20177:34:21 AM"],
	LATTITUDE	:[30.2922902,30.2922902,34.723881,34.723881,34.723881,34.723881],
	LONGITUDE	:[-97.9071442,-97.9071442,-97.9071442,-97.9071442,-97.9071442],
	PACKETTYPE	:[],
	PACKETTYPE_DESC:[]
}
]
	 function checkFlagStatus(value){
					 console.log(value)
				return (value == true)
			}
	$scope.FlagFn = function(val,v2){
		
		/* console.log(val.Flag0)
		if(v2 == 0)		console.log(val.Flag0.find(checkFlagStatus)) */

		var data = (v2==0?val.Flag0.find(checkFlagStatus) : (v2==1 ? val.Flag1.find(checkFlagStatus): (v2==2 ? val.Flag2.find(checkFlagStatus): "")));
			return data
		}
	
	$scope.changeColor = function(data,index){
	if(index == 0 && data == true ){
		$scope.message = "packet have exceeded permissible vibration range";
	}	if(index == 1 && data == true){
			$scope.message = "Packet is exposed to direct sunlight and high humidity";
		}	if(index == 2 && data == true){
				$scope.message = "Packet is exposed to intense heat and humidity";
			}
	};
	$scope.changeColordrop = function(){
	$scope.message= false;
	};
	
	$scope.PacketLoad = function(index){
		$scope.packetNum = index;
		$scope.packetDetail = $scope.packets[index];
		console.log($scope.packetDetail)
	}
	$scope.packetDetailFlag = function(index){
		var flagNum = "Flag"+$scope.packetNum;
		console.log($scope.packetDetail[flagNum][index])
		return ($scope.packetDetail[flagNum][index])
		
	}
	
	
	/* Vibration Meter : avg (accelZ, gyroZ) > 50 : Red Flag showing packet have exceeded permissible vibration range */
	var Vibration_Meter = [];
	for(var i=0; i<$scope.packets[0].ACCELZ.length; i++ ){
		if((($scope.packets[0].ACCELZ[i] + $scope.packets[0].GYROZ[i])/2) > 50){
			Vibration_Meter.push(true)
			
		}else{
			Vibration_Meter.push(false)
		}
	};
		$scope.packets[0]["Flag0"] = Vibration_Meter;
	
/* 	    Packettype : 2 (LIGHT Sensitive) 
 ->  If light > 50 and Humidity >70    : Red Flag : Packet is exposed to direct sunlight and high humidity
 */
var lightFlag = [];
		for(var i=0; i<$scope.packets[1].LIGHT.length; i++ ){
		if(($scope.packets[1].LIGHT[i]>50 && $scope.packets[1].HUMIDITY[i]>70)){
			lightFlag.push(true)
		}else{
			lightFlag.push(false)
		}
	};
	$scope.packets[1]["Flag1"]=lightFlag;

/* 	      Packettype : 3 (Heat Sensitive)   
 ->  If objectTemp > 50 and humidity > 70 : Red Flag : Packet is exposed to intense heat and humidity
  */
var TemperatureFlag = [];
		for(var i=0; i<$scope.packets[2].OBJECTTEMP.length; i++ ){
		if(($scope.packets[2].OBJECTTEMP[i]>50 && $scope.packets[2].HUMIDITY[i]>70)){
			TemperatureFlag.push(true)
		}else{
			TemperatureFlag.push(false)
		}
	};	
	$scope.packets[2]["Flag2"]=TemperatureFlag;
	$scope.packet1 = $scope.packets[0].Flag0.find(checkFlagStatus)?["gauge-red","transform: rotate(80deg)"]:["","transform: rotate(-80deg)"];
	$scope.packet2 = $scope.packets[1].Flag1.find(checkFlagStatus)?["gauge-red","transform: rotate(80deg)"]:["","transform: rotate(-80deg)"];
	$scope.packet3 = $scope.packets[2].Flag2.find(checkFlagStatus)?["gauge-red","transform: rotate(80deg)"]:["","transform: rotate(-80deg)"];
	console.log($scope.packets)
	});