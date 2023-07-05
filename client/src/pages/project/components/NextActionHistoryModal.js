// import classes from "./NextActionHistoryModal.module.css";
import CustomModal from '../../../components/UI/CustomModal'

const NextActionHistoryModal = (props) => {
  const { nextActionHistoryItem, nextActionHistory } = props

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      hideButton={true}
      title={`Next action history for ${nextActionHistoryItem}`}
    >
      <div>
        {nextActionHistory.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Previous</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {nextActionHistory.map((row) => (
                  <tr key={row._id}>
                    <td>{row.data}</td>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No history for the item</div>
        )}
      </div>
    </CustomModal>
  )
}

export default NextActionHistoryModal
