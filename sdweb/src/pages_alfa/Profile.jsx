import {useState} from "react";
import {Sidebar,Topbar} from "./sidebar";
const profileData={
    name:"Sanjida Islam",
    email: "sanjida.islam@gmail.com",
    phone: "01712345678",
    bloodGroup:"O+",
    location:"Sylhet,Bangladesh",
    verified:true,
};
const stats=[
    ["12","Total Requests"],
    ["4","Approved"],
    ["5","Pending"],
];
export default function Profile({goTo}){
    const [isEditing, setIsEditing]=useState(false);
    const [formData, setFormData]= useState(profileData);
    function handleChange(e){
        const { name,value }=e.target;
        setFormData((prev)=>({...prev,[name]:value}));
    }
    function handleEditClick(){
        if(isEditing){
            console.log("Saved Profile:", formData);
        }
        setIsEditing((prev)=>!prev);
    }
    return(
        <div className="Profile-layout">
            <style>{css}</style>
            <sidebar goTo={goTo} current="profile" />
            <div className="main-content">
                <Topbar
                title="My Profile"
                subtitle="Manage your personal information"
                />
                {/* top card= avatar+name+ badge */}
                <div className ="profile-card">
                    <div className="avatar-circle">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="profile-info">
                        <h3>{formData.name}</h3>
                        <p>{formData.email}</p>
                        <div className="badges">
                            {profileData.verified && (
                                <span className="badge badge-verified">
                                    Verified Account
                                </span>
                            )}
                            <span className="badge badge-blood">
                                {formData.bloodGroup}
                            </span>
                        </div>
                    </div>
                </div>
                {/* personal info form */}
                <div className="info-card">
                    <h3>Personal Information</h3>
                    <div className="field-row">
                        <div className="field-group">
                            <label>Full Name</label>
                            <div className="input-box">
                                <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <label>Phone Number</label>
                            <div className="input-box">
                                <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="field-row">
                        <div className="field-group">
                            <label>Email Address</label>
                            <div className="input-box">
                                <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="field-group">
                            <label>Blood Group</label>
                            <div className="input-box">
                                <input
                                type="text"
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="field-group">
                        <label>Address</label>
                        <div className="input-box">
                            <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <button className="edit-btn" onClick={handleEditClick}>
                        <i className={`fa-solid ${isEditing? "fa-check":"fa-pen"}`}></i>{" "}
                        {isEditing ? "Save profile":"Edit Profile"}
                    </button>
                </div>
                {/*Bottom stats*/}
                <div className="stats-row">
                    {stats.map(([value,label])=>(
                        <div className="stat-box" key={label}>
                            <div className="stat-value">{value}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
const css=`
.profile-layout{
display:flex;
min-height:100vh;
background:var(--cream-bg);
}
.main-content{
flex:1;
padding:24px 35px;
}
/*for Top profile */
.profile-card{
background:white;
border:1px solid #eee3d0;
border-radius:14px;
padding:24px 28px;
display:flex;
align-items:center;
gap:20px;
margin-bottom:16px;
}
.avatar-circle{
width:90px;
height:90px;
min-width:90px;
border-radius:50%;
background: #f1dca0;
display:flex;
align-items:center;
justify-content:center;
font-size:34px;
color: #d99e1f;
}
.profile-info h3{
margin: 0 0 4px;
font-size:22px;
}
.profile-info p{
margin:0 0 10px;
font-size:14px;
color: #555;
}
.badges{
display:flex;
gap:8px;
}
.badge{
padding:5px 12px;
border-radius:20px;
font-size:12px;
}
.badge-verified{
color: #135a38b8;
background: #74d6a5dc;
}
.badge-blood{
color: #d94b4b;
background: #d94b4b22;
}
/*info form card */
.info-card{
background: white;
border: 1px solid #eee3d0;
border-radius: 14px;
padding: 24px 28px;
margin-bottom: 16px;
}
.info-card h3 {
  margin: 0 0 18px;
  font-size: 19px;
}
 
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
 
.field-group {
  margin-bottom: 18px;
}
 
.field-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}
 
.input-box {
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border: 1px solid #f1dca0;
  border-radius: 10px;
  background: var(--cream-bg);
}
 
.input-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
}
 
.input-box input:disabled {
  color: black;
  opacity: 1;
  cursor: default;
}
 
.edit-btn {
  padding: 13px 26px;
  background: var(--primary-orange);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}
 
.edit-btn:hover {
  background: rgb(242, 241, 239);
  border: 1px solid orange;
}
 
/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
 
.stat-box {
  background: #fdf1e3;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
}
 
.stat-value {
  font-size: 26px;
  font-weight: bold;
}
 
.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: #555;
}
`;
 