<template>
    <div class="robot_container">
        <div class="top">
            <img class="bg_img" src="~@/assets/img/b_1.png" alt="">
            <div class="top_bottom">
                <div class="item">
                    <img class="icon" src="~@/assets/img/icon_1.png" alt="">
                    <div class="text_desc">
                        <div class="title">真人语音</div>
                        <div>真人语音、多轮会话、支持打断</div>
                    </div>
                    <img class="line" src="~@/assets/img/line_1.png" alt="">
                </div>.
                <div class="item">
                    <img class="icon" src="~@/assets/img/icon_2.png" alt="">
                    <div class="text_desc">
                        <div class="title">情绪判断</div>
                        <div>通过客户语气情绪识别客户的意向</div>
                    </div>
                    <img class="line" src="~@/assets/img/line_1.png" alt="">
                </div>
                <div class="item">
                    <img class="icon" src="~@/assets/img/icon_3.png" alt="">
                    <div class="text_desc">
                        <div class="title">自动拨打</div>
                        <div>批量导入客户资料，按计划拨打客户电话</div>
                    </div>
                    <img class="line" src="~@/assets/img/line_1.png" alt="">
                </div>
                <div class="item">
                    <img class="icon" src="~@/assets/img/icon_4.png" alt="">
                    <div class="text_desc">
                        <div class="title">多种场景</div>
                        <div>支持到期还款提醒、催收提醒、借款提醒等多个场景</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="middle">
            <div class="item">
                <div class="title">
                    <span>您的企业在电话销售中是否遇到这些困难?</span>
                </div>
                <div class="main">
                    <img class="img_1" src="~@/assets/img/p1.png" alt="">
                </div>
            </div>
            <div class="item">
                <div class="title" >
                    <span>快使用AI智能电话机器人</span>
                </div>
                <div class="main" style="padding-bottom:0;">
                    <div class="item">
                        <img class="item_icon" src="~@/assets/img/1.png" alt="">
                        <div class="text_main">
                            <img src="~@/assets/img/line_2.png" alt="">
                            <h3 class="item_title">情绪饱满，不会波动</h3>
                            <p>电话机器人每一通电话都能已最优的语音和回答和客户交流。</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="main" style="padding:0;">
                    <div class="item">
                        <div class="text_main" style="padding:0 0 0 10%;">
                            <img src="~@/assets/img/line_2.png" alt="">
                            <h3 class="item_title">效率更高，永不疲倦</h3>
                            <p>创建外呼计划，一键导入,号码自动拨号,24小时在线无需培训,更不会因外界原因影响效率。</p>
                        </div>
                        <img class="item_icon" src="~@/assets/img/2.png" alt="">
                    </div>
                </div>
            </div>
             <div class="item">
                <div class="main" style="padding-top:0;">
                    <div class="item">
                        <img class="item_icon" src="~@/assets/img/3.png" alt="">
                        <div class="text_main">
                            <img src="~@/assets/img/line_2.png" alt="">
                            <h3 class="item_title">成本更低，无惧枯燥</h3>
                            <p>电话机器人只有外呼人员的10分之一成本完美替代人工进行客户的初步筛选，让外呼人员负责深度沟通工作更有效。</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <img style="width:100%;display:flex;"  src="~@/assets/img/p3.png" alt="">
        <div class="footer">
            <div class="footer_div">
                <p class="footer_title">点击试听</p>
                <p class="text_info">专业贷款话术，快速挖掘潜在客户。想要在茫茫人海中寻找贷款意向用户是很有难度的，这就需要高效和精准的判断筛选，用AI语音电话机器</p>
                <aplayer
                    :music="{
                        src: 'https://static.****.com/saas-res/audio/example.wav'
                    }"
                    theme="#409EFF"
                />
            </div>
        </div>

        <div class="fixed_right">
            <div class="item tel">
                <img src="~@/assets/img/fix_1.png" alt="">
                <p>电 话 咨 询</p>

                <div class="tel_info">
                    详情请咨询商务人员132 0581 2995
                </div>
                
            </div>
            <img src="~@/assets/img/line_3.png" alt="" >
            <div class="item" @click="handlcScroll">
                <img src="~@/assets/img/fix_2.png" alt="">
                <p>返 回 顶 部</p>
            </div>
            
        </div>
    </div>
</template>
<script>
import Aplayer from 'vue-aplayer'
export default {
    data(){
        return {

        }
    },
    methods: {
        handlcScroll(){
            (function smoothscroll(){
                var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
                if (currentScroll > 0) {
                    window.requestAnimationFrame(smoothscroll);
                    window.scrollTo (0,currentScroll - (currentScroll/5));
                }
            })(); 
        }
    },
    components: {
        Aplayer
    }
}
</script>
<style lang="scss" >


.robot_container {
    .aplayer-pic .aplayer-button .aplayer-fill{
        fill: #409EFF;
    }
    padding-bottom: 183px;
    min-width: 1190px;
    background: #ffffff;
    .fixed_right{
        position: fixed;
        right: 0;
        bottom: 200px;
        background-image: url('~@/assets/img/fix_bg.png');
        background-size: 100% 100%;
        width: 80px;
        height: 170px;
        box-sizing: border-box;
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        .item{
            position: relative;
            text-align: center;
            cursor: pointer;
            img{
                margin-top: 20px;
                margin-bottom: 10px;
            }
        }
        .tel_info{
            position: absolute;
            top: 0;
            left: 0;
            height: 82px;
            box-sizing: border-box;
            padding: 10px;
            background: #008ce5;
            display:none;

        }
        .tel:hover .tel_info{
            display: block;
        }
    }
    .aplayer{
        margin: 20px 0 30px 0;
        overflow: visible;
        background-image: -moz-linear-gradient( -90deg, rgb(232,232,232) 0%, rgb(220,220,220) 40%, rgb(208,208,208) 100%);
        background-image: -webkit-linear-gradient( -90deg, rgb(232,232,232) 0%, rgb(220,220,220) 40%, rgb(208,208,208) 100%);
        background-image: -ms-linear-gradient( -90deg, rgb(232,232,232) 0%, rgb(220,220,220) 40%, rgb(208,208,208) 100%);
        box-shadow: 0px 3px 1px 0px rgba(255, 255, 255, 0.2),inset 0px 3px 6px 0px rgba(0, 0, 0, 0.15);
    }
    .aplayer-pic .aplayer-play{
        background-image: -moz-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        background-image: -webkit-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        background-image: -ms-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        box-shadow: 0px 3px 4px 0px rgba(32, 39, 43, 0.1);
        border: none;
    }
    .aplayer-pic{
        background: none ;
        height: auto;
    }
    .aplayer-pic .aplayer-pause {
        width: 26px;
        height: 26px;
        border: none;
        bottom: 50%;
        right: 50%;
        margin: 0 -15px -15px 0;
        background-image: -moz-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        background-image: -webkit-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        background-image: -ms-linear-gradient( 90deg, rgb(216,218,220) 0%, rgb(242,243,243) 100%);
        box-shadow: 0px 3px 4px 0px rgba(32, 39, 43, 0.1);
    }
    .aplayer-pic .aplayer-pause .aplayer-icon-pause {
        position: absolute;
        top: 3px;
        left: 2.5px;
        height: 20px;
        width: 20px;
    }
    .aplayer .aplayer-body .aplayer-info .aplayer-music{
        display: none;
    }
    .aplayer .aplayer-body .aplayer-info{
        height: 50px;
        overflow: visible;
        padding-top: 20px;
    }
    .aplayer-icon-mode {
        display: none;
    }
    .aplayer-volume-wrap{
        z-index: 111;
    }
    .bg_img{
        width:100%;
    }
    .top{
        position: relative;
        .top_bottom{
            position: absolute;
            bottom:ceil(100% - 96);
            width: 90%;
            height:ceil(100% - 83);
            background: #ffffff;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0px 7px 24px 0px rgba(0, 0, 0, 0.14);
            display:flex;
            .item{
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .title{
                    font-weight: 700;
                    margin-bottom: 2%;
                }
                .icon{
                    display: inline-block;
                    margin-right: 5%;
                }
                .text_desc{
                    display: inline-block;
                    margin-bottom: 2%;
                    width: 70%;

                }
                .line{
                    position: absolute;
                    right: 0;
                    top: 50%;
                    // height: ;
                    transform: translateY(-50%);
                }
            }
        }
    }
    .middle{
        padding-top: 68px;
        text-align: center;
        .title{
            padding: 0 30px 10px;
            background-image: url('~@/assets/img/title_bg.png');
            background-size: 100% 100%;
            display: inline-block;
            span{
                display: inline-block;
                vertical-align: top;
                margin-top: -8px;
            }
        }
        .main{
            padding: 30px 0 70px;
           
            .img_1{
                width: 70%;
            }
            .item{
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 70%;
                box-sizing: border-box;
                
                .item_icon{
                    
                }
                .text_main{
                    display: inline-block;
                    text-align: left;
                    padding:0 10% 0 0;
                    img{
                        margin-bottom: 24px;
                    }
                    .item_title{
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }
    .footer{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-image: url('~@/assets/img/footer_bg.png');
        background-size: 100% 100%;
        color: #ffffff;
        text-align: center;
        .footer_div{
            display: inline-block;
            padding-left:5%; 
            width: 40%;
            line-height: 1.5;
            .footer_title{
                padding: 12px 0 0 5px;
            }
            .text_info{
                text-align: left;
            }
        }
    }
}

    @media screen and (max-width:1220px){
        .robot_container{
            font-size: 14px;
            .item_title{
                font-size: 22px;
            }
            .footer_title{
                font-size: 18px;
            }
            .text_info{
                font-size: 12px;
            }
            .icon{
                height: 45px;
            }
        }
        
    }
    @media screen and (min-width:1220px){
        .robot_container{
            font-size: 16px;
            .item_title{
                font-size: 24px;
            }
            .footer_title{
                font-size: 20px;
            }
            .text_info{
                font-size: 14px;
            }
        }
        
    }


    
</style>
