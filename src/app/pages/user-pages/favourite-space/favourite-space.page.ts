import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import 'firebase/firestore';
import 'firebase/auth';
import { IonInfiniteScroll } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { OwnerServiceService } from 'src/app/services/owner.service';
import { SignInSignUpService } from 'src/app/sign-in-sign-up.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

import {  PopoverController } from '@ionic/angular';
import { MessagesPage } from 'src/app/feedback/messages/messages.page';

@Component({
  selector: 'app-favourite-space',
  templateUrl: './favourite-space.page.html',
  styleUrls: ['./favourite-space.page.scss'],
})
export class FavouriteSpacePage implements OnInit {

 
  address:any;
  price:any;
   total =0;
   category_number:any;
  spaceuid = this.route.snapshot.params.spaceuid;
  profuid = this.route.snapshot.params.profuid;
  spaceId= this.route.snapshot.params.spaceId;
  deletebyuid=this.route.snapshot.params.favouriteuid
  categories: any;
  image: any;
  description: any;
  amenities: any=[];
  extraAmenities: any=[];

  extras:any=[]
  dateBooked:any=[];
  dateBookednum:number=-1;
  dateBookedStatus:boolean
  hoursbooked:number;
  messageValue: string;
  comments: number=0;
  //spaceuid/:profileuid
  getSpaceuid = this.route.snapshot.params.spaceuid;
  getProfuid = this.route.snapshot.params.profilesuid;
  profileuid = this.route.snapshot.params.profileuid;
  // getProfuid =this.userservice.getProfuid();
  // getSpaceuid=this.userservice.getSpaceuid();
  getSpaceId=this.userservice.getSpaceId();
  uid: any;
  
  favouriteuid: string;
  userprofileuid: string;
  workspace_uid: any;
  favSpace: string;
  

  public minTime = moment().format('hh:mm');
  public minDate = moment().format('YYYY-MM-DD');
  public maxDate = moment().add(5,'y').format('YYYY')
  constructor( private popover:PopoverController,private router: Router,private formBuilder:FormBuilder,public userservice :UserService,private route:ActivatedRoute,public ownerservice:OwnerServiceService,public account:SignInSignUpService) { 


    
  
    console.log(this.account.getUserSession())
    firebase.firestore().collection("profiles")
    .doc(this.getProfuid)
    .collection("profile").doc(this.profileuid).collection("space").doc(this.getSpaceuid).get().then(doc=>{
        this.address = doc.data().address;
        this.categories = doc.data().categories
        this.image = doc.data().image;
        this.description =  doc.data().description;
        this.amenities .push(doc.data().amenities) ;
        this.price = parseInt(doc.data().price, 10); 
        this.category_number= doc.data().category_number;
        this.uid= doc.data().uid;
        this.profileuid= doc.data().user_uid
        this.favSpace=doc.id;
        this.workspace_uid= doc.data().workspace_uid
      //  this.extraAmenities.push(doc.data().extraAmenities) ;
       console.log( doc.data())
    })
  

  }

////////////Comment Form//////////////
previewForm = this.formBuilder.group({
  comment:['', [Validators.required,Validators.maxLength(100),Validators.minLength(4)]]
});
isValidInputComments(fieldName): boolean {
  return this.previewForm.controls[fieldName].invalid &&
    (this.previewForm.controls[fieldName].dirty ||
     this.previewForm.controls[fieldName].touched);
     
}
get comment() {
  return this.reservationForm.get("comments");
}
public errorMessagesComment = {
  comment: [
    { type: 'required', message: 'comment is required' }
  ]
};


  reservationForm = this.formBuilder.group({
    checkin: ['', [Validators.required]],
    timein: ['', [Validators.required]],
    checkout: ['', [Validators.required]],
    timeout: ['', [Validators.required]]   
});
isValidInput(fieldName): boolean {
  return this.reservationForm.controls[fieldName].invalid &&
    (this.reservationForm.controls[fieldName].dirty || this.reservationForm.controls[fieldName].touched);
}

get checkin() {
  return this.reservationForm.get("checkin");
}
get timein() {
  return this.reservationForm.get("timein");
}

get checkout() {
  return this.reservationForm.get("checkout");
}
get timeout() {
  return this.reservationForm.get("timeout");
}

public errorMessages = {
  checkin: [
    { type: 'required', message: 'checkin is required' }
  ],
  timein: [
    { type: 'required', message: 'timein is required' }
  ],
  checkout: [
    { type: 'required', message: 'checkout is required' }
  ],
  timeout: [
    { type: 'required', message: 'timeout is required' }
  ],
};

  ngOnInit() {
   this. checkIfBooked()
   this.getFavouritesuid()
  }

addExtras(x,y){
  this.total +=parseInt(y, 10);
  var totalCost;
  totalCost =this.total+this.price;
  this.extras.push(Object.assign({'extraAmenities':x},{'price':y},{'extrasTotal':this.total},{'totalCost':totalCost}))

}
getExtras(){
 return this.extras;
}

submit(){
  var outdate = parseInt(this.reservationForm.value.timeout)
  var indate=parseInt(this.reservationForm.value.timein);
  
    this.hoursbooked=( outdate - indate);
    if( this.hoursbooked < 1) {
      this.messageValue = "Booking time must atleast be an hour"
    }

  else if(this.checkIfBooked() ==1){
    this.messageValue ="Time choosen is already booked"

  }else{
    console.log(0)
      --this.category_number;
this.userservice. changeCategoryNum(this.userservice.getSpaceuid(),this.userservice.getProfuid(), this.category_number-1)
this.userservice. reservation(this.userservice.getProfuid(), this.userservice.getSpaceuid(), this.userservice.getSpaceId(), this.account.getUserSession(),  this.reservationForm.value.checkin,  
                       this.reservationForm.value.checkout, 
                       this.reservationForm.value.timein, 
                       this.reservationForm.value.timeout, this.getExtras(), this.category_number,this.hoursbooked,indate,outdate)

  this.getExtras()
  console.log(  this.reservationForm.value.checkin+"/"+
                this.reservationForm.value.timein+"/"+
                this.reservationForm.value.checkout+"/"+
                this.reservationForm.value.timeout
                )
               this. CreatePopover() 
  }
 

}
back(){
  this.router.navigateByUrl('favourites');
  this.userservice.setAllnull();
}

checkIfBooked():number{

  var outdate = parseInt(this.reservationForm.value.timeout)
  var indate=parseInt(this.reservationForm.value.timein);


  firebase.firestore().collection("profiles")
  .doc(this.userservice.getProfuid())
  .collection("profile").doc(this.userservice.getSpaceuid())
  .collection("space").doc(this.userservice.getSpaceId())
  .collection("reservation")
  .where("space_uid","==",this.userservice.getSpaceId())
   .where("checkin","==",this.reservationForm.value.checkin)
   .where("indate","==",indate)
   .where("outdate","==",outdate)
  .where("checkout","==",this.reservationForm.value.checkout)
 
  .get().then(doc=>{
      doc.forEach(exist=>{
        this.dateBooked.push(exist.data())
       this.dateBookednum = (this.dateBooked.length)
        this.dateBookedStatus = true;
      })
  })
if(this.dateBookednum>0){
  return 1;
}else{
  return 0;
}
 

}


previews(){
  this.comments = 1;
}
sendComment(){
  this.userservice.previews(this.userservice.getProfuid(), this.userservice.getSpaceuid(), this.userservice.getSpaceId(),this.previewForm.value.comment,this.minTime,this.minDate)
  this.comments = 3;
}
remove(){
  this.comments =0;
}

deleteFavourites(){
  // console.log("profile:"+ profileuid)
  // console.log("profiles:"+ profilesuid)
  // console.log("userSession:"+ this.account.getUserSession())
  // console.log("favourite:"+ this.userprofileuid)
//  favourite(useruid,profiles_uid, profile_uid, space_uid)
 this.userservice.  deleteFavourite( this.account.getUserSession(),this.userprofileuid, this.deletebyuid) 
 this.CreatePopover() 
}


getFavouritesuid(){
  firebase.firestore().collection("profiles")
  .doc(this.account.getUserSession())
  .collection("user-profile").get().then(doc=>{
    doc.forEach(favUid=>{
      this.userprofileuid=favUid.id; 
      console.log("We are here 3:"+ this.userprofileuid)
    })
  })
}



CreatePopover() 
{
  this.popover.create({component:MessagesPage,
  showBackdrop:false}).then((popoverElement)=>{
    popoverElement.present();
  })
}

}
