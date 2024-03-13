import Users from '@/pages/models/userModel';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const body = req.body;
  const userExist = await Users.findOne({ email: body.email });
  if (userExist) {
    res.status(200).json({ message: 'Already registered!' });
    return;
  }

  // Genrate salt to hash password
  const salt = await bcrypt.genSalt(10);

  // Set user password to hashed password
  const hashPassword = await bcrypt.hash(body.password, salt)
  const newUser = new Users({email: body.email, password: hashPassword});
  await newUser.save();
  res.status(200).json({ message: 'Registered successfully!' });
}
