import Routing from './Routing'
import { TicketProvider } from './context/context'

function App() {
  return (
      <div>
        <TicketProvider>
          <Routing />
        </TicketProvider>
      </div>
  )
}

export default App
