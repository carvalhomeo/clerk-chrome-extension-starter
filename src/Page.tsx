import { useClerk, useSignUp, useUser } from '@clerk/chrome-extension';
import React, { FormEvent, useState } from 'react'

const Page = () => {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState("");
    const { isLoaded, signUp, setActive } = useSignUp();
    const {user, isSignedIn} = useUser();
    const [errorMessage,] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const { signOut } = useClerk()
  
    if (!isLoaded) {
      return null;
    }
  
    const handleSubmit = async (event: FormEvent<HTMLElement>) => {
      console.log("fuck", isLoaded)
      event.preventDefault();
  
      try {
        console.log("fuck 1")
        await signUp.create({
          emailAddress,
          password,
        });
        console.log("fuck 2")
        // send the email.
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        console.log("fuck 3")
        // change the UI to our pending section.
        setPendingVerification(true);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
      }
    };
  
    const onPressVerify = async (event: FormEvent<HTMLElement>) => {
      event.preventDefault();
      if (!isLoaded) {
        return;
      }
  
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });
        if (completeSignUp.status !== "complete") {
          /*  investigate the response, to see if there was an error
           or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId })
          setPendingVerification(false);
        }
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
      }
    };
  
    const handleSignOut = async () => {
      signOut()
      setPassword('')
      setEmailAddress('')
    }
  
    return (
      <div className="h-full flex flex-col">
        <div id="second" className='grid grid-cols-4 h-full'>
          <div className='col-span-3 bg-purplex-800 p-10'>
            {selectedIndex === 1 && 
            <div id="account" className="h-full flex justify-center items-center">
              <div className='flex flex-col gap-4'>
                {/* <img src={user?.imageUrl} /> */}
                <div>{user?.firstName} {user?.lastName}</div>
                <div>{user?.primaryEmailAddress?.emailAddress}</div>
                {isSignedIn && <button type='button' onClick={handleSignOut}>Sign out</button>}
              </div>
  
              {!pendingVerification && !isSignedIn && <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <label htmlFor="email">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  value={emailAddress} 
                  onChange={(e) => setEmailAddress(e.target.value)} 
                  className='bg-transparent border-2 rounded-md'
                />
                <label htmlFor="password">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className='bg-transparent border-2 rounded-md'
                />
                <p>{errorMessage}</p>
                <button type="submit">Sign Up</button>
                <p>{signUp?.status}</p>
              </form>}
  
              {pendingVerification && !isSignedIn && (
                <div>
                  <form>
                    <input
                      value={code}
                      placeholder="Code..."
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={onPressVerify}>
                      Verify Email
                    </button>
                  </form>
                </div>
              )}
            </div>}
          </div>
        </div>
      </div>
    )
}

export default Page