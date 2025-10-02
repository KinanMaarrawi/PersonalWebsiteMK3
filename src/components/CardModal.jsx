import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import 'antd/dist/reset.css';

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
