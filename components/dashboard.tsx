import React, { useState } from 'react';
import Navbar from './navbar';
import styles from '../styles/Dashboard.module.css';
import Head from 'next/head';
import Spoiler from './spoiler';
import { useUser } from './user';
import { Button, Card, List, Modal, notification, Popconfirm, Table } from 'antd';
import { CameraOutlined, DatabaseOutlined, DeleteOutlined, KeyOutlined, MailOutlined, RedoOutlined } from '@ant-design/icons';
import API, { APIError } from '../api';

export default function Dashboard() {
    const [inviteManager, setInvManager] = useState(false);
    let { user, setUser } = useUser();
    const { images } = user;

    const regenKey = async () => {
        try {
            const data = await API.regenKey();

            if (data.success) {
                user = Object.assign({}, user);
                user.key = data.key;
                setUser(user);

                notification.success({
                    message: 'Success',
                    description: 'Regenerated key successfully.',
                });
            }
        } catch (err) {
            if (err instanceof APIError) return notification.error({
                message: 'Something went wrong',
                description: err.message,
            });
        }
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: '_id',
            key: 'code',
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
        },
    ];

    return (
        <div className={styles.container}>
            <Head>
                <title>Astral Dashboard</title>
            </Head>

            <Navbar enabled="home" />

            <div className={styles.dashboard}>
                <div className={styles.section}>
                    <h1 className={styles.title} style={{
                        marginLeft: '8px',
                    }}>Welcome, {user.username}.</h1>

                    <div className={styles.statsCon}>
                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><CameraOutlined /> Images</div>
                            <div className={styles.statContent}>You have uploaded <strong>{user.uploads}</strong> images.</div>
                        </Card>

                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><DatabaseOutlined /> Storage Used</div>
                            <div className={styles.statContent}>{user.storageUsed}</div>
                        </Card>

                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><MailOutlined /> Invites</div>
                            <Button
                                shape="round"
                                disabled={user.invites <= 0}
                                style={{
                                    marginTop: '3px',
                                }}
                                onClick={() => setInvManager(true)}
                            >
                                Manage Invites (<strong>{user.invites}</strong>)
                            </Button>
                        </Card>

                        <Card className={styles.statsBox}>
                            <div className="ant-statistic-title"><KeyOutlined /> Upload Key</div>
                            <div className={styles.keyCon}>
                                <Spoiler />

                                <Popconfirm
                                    onConfirm={regenKey}
                                    title="Are you sure?"
                                    okText="Yes"
                                    okButtonProps={{
                                        style: {
                                            backgroundColor: 'rgb(37, 37, 37)',
                                            borderColor: '#444444',
                                        },
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        style={{
                                            backgroundColor: '#444444',
                                            border: 'none',
                                            marginLeft: '11px',
                                            marginTop: '-2px',
                                        }}
                                        shape="circle"
                                        icon={<RedoOutlined />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className={styles.section}>
                    <h1 className={styles.title}>Gallery</h1>
                    <p className={styles.galleryCaption}>Here you can view all of your images.</p>

                    <div className={styles.galleryContainer}>
                        <List
                            locale={{ emptyText: 'You haven\'t uploaded any images.' }}
                            dataSource={images.filter((i) => i.filename.split('.')[1] !== 'mp4')}
                            pagination={images.length <= 14 ? false : {
                                pageSize: 14,
                                showSizeChanger: false,
                                responsive: true,
                                style: {
                                    marginLeft: '4px',
                                },
                            }}
                            renderItem={(m) => {
                                return (
                                    <Card
                                        key={m.link}
                                        style={{
                                            width: '241.1px',
                                            height: '170px',
                                            marginBottom: '10px',
                                            marginLeft: '10px',
                                        }}
                                        cover={
                                            <a href={m.link} target="blank">
                                                <img
                                                    style={{
                                                        height: '100px',
                                                        width: '239px',
                                                        objectFit: 'cover',
                                                    }}
                                                    src={m.link}
                                                />
                                            </a>
                                        }
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}>
                                            <span>
                                                <div className="ant-statistic-title" style={{
                                                    marginBottom: '0px',
                                                    marginTop: '-12px',
                                                }}>{m.filename}</div>
                                                <span style={{
                                                    fontSize: '13.6px',
                                                }}>Uploaded at {new Date(m.dateUploaded).toLocaleDateString()}</span>
                                            </span>

                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                marginTop: '-14px',
                                                marginLeft: '15px',
                                                justifyContent: 'center',
                                            }}>

                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: '#e03024',
                                                        border: 'none',
                                                    }}
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            }}
                        />
                    </div>
                </div>

                <Modal
                    title="Invite Manager"
                    visible={inviteManager}
                    onCancel={() => setInvManager(false)}
                    footer={null}
                >
                    <Table
                        rowKey="code"
                        pagination={false}
                        locale={{ emptyText: 'You haven\'t made any invites.' }}
                        dataSource={user.createdInvites}
                        columns={columns}
                    />
                </Modal>
            </div>
        </div>
    );
}

