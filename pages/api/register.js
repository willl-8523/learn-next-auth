import User from '@/pages/models/userModel';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (user) {
    res.status(200).json({ message: 'Already registered!' });
    return;
  }

  const newUser = new User(body);
  const salt = await bcrypt.hash(newUser.password, salt);
  newUser.save().then((doc) => res.status(201).send(doc));
}
