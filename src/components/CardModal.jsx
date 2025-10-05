import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import 'antd/dist/reset.css';

/**
 * CardModal Component
 *
 * A reusable modal component that displays a title, optional image, and description.
 * Uses NiceModal for easy modal management and Ant Design's Modal for UI.
 *
 * Props:
 * @param {string} title - The title displayed at the top of the modal
 * @param {string} description - The body text or description
 * @param {string} [image] - Optional URL of an image to display above the description
 *
 * Behavior:
 * - Modal visibility is controlled by NiceModal's useModal hook
 * - "Close" button hides the modal
 * - Clicking outside or pressing "Esc" also hides the modal
 * - After closing, the modal instance is removed
 *
 * @returns {JSX.Element}
 */
const CardModal = NiceModal.create(({ title, description, image }) => {
    const modal = useModal();

    return (
        <Modal
            title={<span className="text-purple-400">{title}</span>}
            visible={modal.visible}
            onOk={() => modal.hide()}
            onCancel={() => modal.hide()}
            afterClose={() => modal.remove()}
            bodyStyle={{ backgroundColor: '#1f1f1f', color: '#f0f0f0' }}
            style={{ backgroundColor: '#1f1f1f' }}
            okText="Close"
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                />
            )}
            <p style={{ color: '#f0f0f0' }}>{description}</p>
        </Modal>
    );
});

export default CardModal;
