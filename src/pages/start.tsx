import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export const StartPage = () => {
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Button onClick={()=>{
        navigate('/ar')
      }} size={"lg"}>Start</Button>
    </div>
  )
}
