import { useState } from "react"
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react"
import { GiMegaphone} from "react-icons/gi"

const Announcement = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(!open)
  return (
    <>
    <Dialog
      open={open}
      handler={handleOpen}
      className="bg-50"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className="text-white"><span className="text-2xl mr-4"><GiMegaphone /></span> Website Under Development</DialogHeader>
      <DialogBody className="text-gray-300 max-h-96 overflow-y-scroll scroll">
        <Typography className="mb-5">Hello there,</Typography>
        <Typography className="mb-7">
          Welcome to ManwhaKi! As an in-training developer, I&apos;m working diligently behind the scenes to create a seamless and engaging browsing experience for you.
        </Typography>
        <Typography className="mb-3">
          For the time being, I&apos;m dedicating my efforts to improving the website&apos;s foundation. Specifically, I&apos;m working on:
        </Typography>
        <ul className="list-disc px-4 flex flex-col gap-2 mb-8 text-sm">
          <li>Designing a clean and intuitive layout</li>
          <li>Implementing user-friendly functionality</li>
          <li>Bringing exciting content to life</li>
        </ul>
        <Typography className="mb-3">
          For the time being, I&apos;m wearing multiple hats as I work on different aspects of the website. My current priorities include:
        </Typography>
        <ul className="list-disc px-4 flex flex-col gap-2 mb-6 text-sm">
          <li>Fixing image links in the database</li>
          <li>Uploading manga series and chapters, so you&apos;ll have captivating content to explore</li>
          <li>Improving the admin website to streamline management and updates</li>
          <li>Enhancing server and database functionality for a robust user experience</li>
        </ul> 
        <Typography className="mb-6">
          Your patience and support mean the world to me. Feel free to explore the sections that are already up, and know that more is on the way.
        </Typography>
        <Typography className="mb-6">
          If you have any questions or suggestions, I&apos;d love to hear from you. You can reach me at botonesallan7@gmail.com
        </Typography>
        <Typography className="mb-6">
          Thank you for your understanding and for sharing this journey with me.
        </Typography>
        <div>
          <span>Best regards,</span>
          <Typography>ManwhaKi</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" color="green" onClick={handleOpen} className="shadow-none hover:shadow-none">
          <span>Close</span>
        </Button>
      </DialogFooter>
    </Dialog>
      <div className="bg-blue-500">
        <div onClick={handleOpen} className="container px-4 text-white flex items-center gap-4 p-1 cursor-pointer">
          <span className="text-xl"><GiMegaphone /></span>
          <Typography variant="h1"  className="text-sm">
            Website Under Development
          </Typography>
        </div>
      </div>
    </>
  )
}

export default Announcement